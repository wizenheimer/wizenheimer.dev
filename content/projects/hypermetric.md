---
title: Runtime for running distributed evals
date: 2024-07-07
tags: [python, distributed-systems, hypermetric, evals]
---

[Hypermetric](https://github.com/wizenheimer/hypermetric) is a distributed evaluation system for AI products that leverages Ray's actor model and Apache Arrow for efficient parallel processing. It abstracts away distributed computing complexities while handling data sharding, task scheduling, and fault tolerance, allowing ML evaluations to scale seamlessly from local development to large clusters.