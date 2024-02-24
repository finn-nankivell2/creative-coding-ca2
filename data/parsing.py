#!/usr/bin/env python3
import csv
import itertools
from collections import Counter
from pprint import pprint
import logging

logging.basicConfig(level=logging.DEBUG)

TITLE_BASICS = "input/title.basics.tsv"
TITLE_RATINGS = "input/title.ratings.tsv"
TITLE_LOCALIZED = "input/title.akas.tsv"


def reads(rpath, csv_reader=True):

	def outer(f):

		def inner():
			with open(rpath) as rfile:
				reader = rfile
				if csv_reader:
					reader = csv.reader(rfile, delimiter="\t")
					next(rfile)

				f(reader)

		inner.__name__ = f.__name__
		return inner

	return outer


def readswrites(rpath, wpath, csv_reader=True, csv_writer=True):

	def outer(f):

		def inner():
			rfile = open(rpath)
			wfile = open(wpath, "w+")

			reader = rfile
			writer = wfile

			if csv_reader:
				reader = csv.reader(rfile, delimiter="\t")
				next(reader)

			if csv_writer:
				writer = csv.writer(wfile, quotechar="\"", quoting=csv.QUOTE_ALL)

			f(reader, writer)

			rfile.close()
			wfile.close()

		inner.__name__ = f.__name__
		return inner

	return outer


@readswrites(TITLE_BASICS, "outputs/movietypes.csv")
def extract_movie_variants(reader, writer):
	mtypes = set()

	logging.debug("Finding movie types")
	for row in reader:
		mtypes.add(row[1])

	logging.debug("Writing movie variants")
	writer.writerow(["MTYPE"])

	for item in mtypes:
		writer.writerow([item])


@readswrites(TITLE_BASICS, "outputs/genrecounts.csv")
def count_movie_genres(reader, writer):

	def filtered_genres(reader):
		for row in reader:
			if len(row) < 9:
				continue

			genres = row[8].split(",")
			yield genres

	logging.debug("Counting movie genres")
	counter = Counter(itertools.chain(*list(filtered_genres(reader))))

	logging.debug("Writing movie genre counts")
	writer.writerow(["GENRE", "COUNT"])

	for genre, count in counter.items():
		writer.writerow([genre, count])


@readswrites(TITLE_BASICS, "outputs/runtimecounts.csv")
def count_movie_runtimes(reader, writer):
	counter = Counter(filter(str.isnumeric, map(lambda row: row[7], reader)))

	writer.writerow(["RUNTIME", "COUNT"])

	for genre, count in sorted(filter(lambda x: x[1] >= 0, counter.items()), key=lambda x: int(x[0])):
		writer.writerow([genre, count])


@reads(TITLE_RATINGS)
def compute_average_rating(reader):
	logging.debug("Summing movie ratings")
	counter = 0
	total = 0
	for row in reader:
		rating, votes = float(row[1]), int(row[2])

		counter += votes
		total += rating * votes

	print(f"Average rating: {total / counter}")


@readswrites(TITLE_RATINGS, "outputs/ratingdist.csv")
def extract_movie_rating_distribution(reader, writer):
	logging.debug("Creating rating ranges dictionary")
	ratings_list = list(zip(range(1, 10), range(2, 11)))
	ratings = {f"{a} - {b}": 0 for a, b in ratings_list}

	logging.debug("Adding movie ratings to distribution")
	for row in reader:
		rating = float(row[1])
		for a, b in ratings_list:
			if a <= rating < b:
				ratings[f"{a} - {b}"] += 1

	logging.debug("Writing movie rating distributions")
	writer.writerow(["RANGE", "COUNT"])
	writer.writerows(ratings.items())


@readswrites(TITLE_BASICS, "outputs/movietypecounts.csv")
def count_movies_by_variant(reader, writer):
	logging.debug("Finding movie variants")
	movie_types = None
	with open("outputs/movietypes.csv") as mtfile:
		mt_reader = csv.reader(mtfile)
		next(mt_reader)

		movie_types = Counter({k: 0 for k in map(lambda row: row[0], mt_reader)})

	logging.debug("Find variant counts")
	for row in reader:
		mt = row[1]
		movie_types[mt] += 1

	logging.debug("Writing counts")
	writer.writerow(["VARIANT", "COUNT"])
	writer.writerows(movie_types.items())


@readswrites(TITLE_RATINGS, "outputs/ratingpop.csv")
def calc_movie_rating_vs_popularity(reader, writer):
	logging.debug("Sorting ratings by popularity")
	ratings = sorted(reader, key=lambda row: int(row[2]))

	titles_top10 = list(reversed(ratings[-10:]))
	logging.debug("Getting movie titles from tconst")

	counted_titles = 0
	with open(TITLE_BASICS) as file:
		basics_reader = map(lambda row: [row[0], row[2]], csv.reader(file, delimiter="\t"))
		for tconst, title in basics_reader:
			for entry in titles_top10:
				if entry[0] == tconst:
					logging.debug(f"Found tconst match for title \"{title}\"")
					entry[0] = title
					counted_titles += 1

			if counted_titles == len(titles_top10):
				break


	logging.debug("Writing compared ratings to popularity for top 10 movies")
	writer.writerow(["MOVIE", "RATING", "POPULARITY"])

	max_popularity = int(titles_top10[0][2])
	for row in titles_top10:
		tconst, rat, pop = row[0], float(row[1]), int(row[2])
		rat = max_popularity * (rat/10.0)
		writer.writerow([tconst, rat, pop])



def main():
	jobs = [
		# Put all jobs to run in here
		# extract_movie_variants,
		# compute_average_rating,
		# extract_movie_rating_distribution,
		# count_movie_genres,
		# count_movie_runtimes,
		# extract_movie_rating_distribution_detailed,
		# count_movies_by_variant,
		calc_movie_rating_vs_popularity,
	]

	for job in jobs:
		print(f"--- Running job {job.__name__} ---")
		job()


if __name__ == "__main__":
	main()
