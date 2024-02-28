# Creative Computing DataVis Report

Finn Nankivell

## Introduction

For my data visualization project, I initially started out with data from the CSO, concerning children with disabilities in various counties in Ireland. However I quickly realised that the data was insufficient for detailed analysis, and invalid due to many counties not being counted / data being unavailible. I was also not particularily interested in the topic, and that made it a little harder to work on. So I switched to another dataset, which is an archive of IMDB listings from 2017, provided on the IMDB website. This was a dataset I had used before on another project and was somewhat familiar with. It has detailed information on title ratings, runtimes, genres, etc. However the dataset is huge, in order to reduce file size it is split into multiple CSV files based on topic with a primary key identifying each title across multiple files. Despite that, they are still very large files, the smallest one being 700mb. So in order to use this in the browser, I was going to have to preprocess them.

I decided to use Python to preprocess the data, since it is a language I am familiar with and the standard library has good tools for processing CSV files. I created a basic in-out data pipeline function structure and wrote several functions to read in the various CSV files from IMDB and write out processed data that can be loaded into the browser very easily. The file can be found in data/parsing.py in the repository. Here are some of the datapoints that I was able to gather with this approach.

- Compute the average rating / 10 given to all titles

- Get the distribution of average ratings given to titles

- Find which genres are the most popular

- Get the distribution of title runtimes

- Calculate a title's popularity vs how much it scores out of 10

- Find which type of title is the most common


## Bar Charts

In total my codebase supports six different chart types, listed here: bar charts, stacked bar charts, stacked bar charts that stretch to the top of the chart, horizontal bar charts, clustered charts, and pie charts. These different chart types are encapsulated in a BarChart class, and are passed to the BarChart config, which verifies that the given chartType is valid. the \_verifyConfig method in charts/BarChart.js is used to ensure that the object that was passed to the BarChart constructor meets the minimum requirements and gives all the necessary information to construct a BarChart.

All of these charts share similar behaviour, namely similar configuration. Every BarChart needs to be passed a config object, and every BarChart needs data, and a dataKey which is used to find the correct column in the CSV. The dataKey is expected by be a string for normal charts, horizontal charts, and pie charts, and an array for stacked, stacked 100% and clustered charts. All charts can also take a label parameter, which is used to find the column in the CSV that is used to for labelling different parts of the chart. There are some other values that the chart config needs to include, which are defined in the \_verifyConfig function.

Before rendering occurs, the bar chart has to be translated to the desired X and Y positions. push() and pop() are used to ensure that the translate() function's effects are local to the current function scope. The normal, stacked, stacked 101%, and clustered bar charts use mostly the same rendering method, which involves iterating over every row and drawing bars for each dataKey value in the row. The bars are drawn using rect(), the rect's width is determined by barWidth - defined in the BarChart constructor - and the rect's height is calculated using the value for the current row given by row[dataKey]. They then translate along so that the next rect will be in the correct position. Translation level in controlled by barGap, which is calculated in the BarChart constructor. For the horizontal chart, it is the same except that it draws the rects across and translates down. For the pie chart, the rendering is done by first getting the sum of all data values and then iterating over every data value, dividing it by the sum, and using that find out what percentage of the pie chart it should take up. arc() is then used to draw the pie slice, and it increments on to repeat the process again.

Additional rendering has to occur for the labels, ticks, and legend. The labels are drawn as the bars are drawn, at the same points as the bars. The ticks are drawn by first getting the return value of the BarChart.\_getDataTicks() method, which returns the increments that will be displayed, based on the size of the dataMax and the number of ticks needed. The array returned by this function is then incremented, and the ticks rendered up the side of the chart at intervals of tickGap, which is the chartHeight divided by the number of ticks. The legend is rendered based on an array given by the user, defining which names match which colours. It is drawn to the right of the graph by iterating this array and drawing rects with text beside them


## Reflection

It was a little tough to start the project, but overall I enjoyed it and learned more than I expected to. I thought that in the end my code quality could've been better. I was pleased with the Python I wrote to preprocess the data, but my Javascript could definitely use some refactoring. I did manage to get all of the charts into a single class which reduced some code duplication, but it also increased the complexity and length of many of my functions. I could have improved the code by splitting it up into smaller methods for different parts of the program, which I did more towards the end.
