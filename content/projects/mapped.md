---
title: Implementing Map-Reduce paper in Go
date: 2023-07-22
tags: [distributed-systems, go, map-reduce]
---

[Introduces](https://github.com/wizenheimer/mapreduce) a concurrent implementation of the map-reduce paradigm as a function in Go. This is inspired by the seminal paper "MapReduce: Simplified Data Processing on Large Clusters" by Jeffrey Dean and Sanjay Ghemawat. MapReduce is a programming model and associated implementation for processing and generating large datasets that can be parallelized across distributed clusters of computers. The primary goal of MapReduce is to make it easy for developers to write scalable and fault-tolerant data processing applications.