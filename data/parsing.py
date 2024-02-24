#!/usr/bin/env python3
import csv
import itertools
from collections import Counter
from pprint import pprint

TITLE_BASICS = "input/title.basics.tsv"
TITLE_RATINGS = "input/title.ratings.tsv"


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

	for row in reader:
		mtypes.add(row[1])

	writer.writerow(["MTYPE"])

	for item in mtypes:
		writer.writerow([item])


@readswrites(TITLE_BASICS, "outputs/genrecounts.csv")
def count_movie_genres(reader, writer):
	counter = Counter(filter(lambda x: x, map(lambda row: row[8] if len(row) >= 9 else None, reader)))
	print(counter)


@reads(TITLE_RATINGS)
def compute_average_rating(reader):
	counter = 0
	total = 0
	for row in reader:
		rating, votes = float(row[1]), int(row[2])

		counter += votes
		total += rating * votes

	print(f"Average rating: {total / counter}")


@readswrites(TITLE_RATINGS, "outputs/ratingdist.csv")
def extract_movie_rating_distribution(reader, writer):
	ratings_list = list(zip(range(1, 10), range(2, 11)))

	ratings = {f"{a} - {b}": 0 for a, b in ratings_list}

	for row in reader:
		rating = float(row[1])
		for a, b in ratings_list:
			if a <= rating < b:
				ratings[f"{a} - {b}"] += 1

	writer.writerow(["RANGE", "COUNT"])

	for row in ratings.items():
		writer.writerow(row)



def main():
	jobs = [
		# extract_movie_variants,
		# coumovgenres,
		# compute_average_rating,
		extract_movie_rating_distribution,
	]

	for job in jobs:
		print(f"Running job {job.__name__}")
		job()


if __name__ == "__main__":
	main()
