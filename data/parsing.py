#!/usr/bin/env python3
import csv
import itertools
from collections import Counter

TITLE_BASICS = "title.basics.tsv"


def readswrites(rpath, wpath):

	def outer(f):

		def inner():
			RFILE = open(rpath)
			WFILE = open(wpath, "w+")

			f(RFILE, WFILE)

			RFILE.close()
			WFILE.close()

		inner.__name__ = f.__name__
		return inner

	return outer


@readswrites(TITLE_BASICS, "outputs/movietypes.csv")
def extract_movie_variants(rfile, wfile):
	mtypes = set()
	reader = csv.reader(rfile, delimiter="\t")
	next(reader)

	for row in reader:
		mtypes.add(row[1])

	writer = csv.writer(wfile)
	writer.writerow(["MTYPE"])

	for item in mtypes:
		writer.writerow([item])


@readswrites(TITLE_BASICS, "outputs/genrecounts.csv")
def count_movie_genres(rfile, wfile):
	reader = itertools.islice(csv.reader(rfile, delimiter="\t"), 100)
	next(reader)

	counter = Counter(filter(lambda x: x, map(lambda row: row[8] if len(row) >= 9 else None, reader)))

	print(counter)
	# writer = csv.writer(wfile)


def main():
	jobs = [count_movie_genres]

	for job in jobs:
		print(f"Running job {job.__name__}")
		job()


if __name__ == "__main__":
	main()
