---
title: Bloom Filter Implementation in Go
date: 2023-08-02
tags: [go, bloom-filter, data-structures]
---

A [Bloom](https://github.com/wizenheimer/bloom) filter implementation in Go that provides probabilistic set membership testing with space efficiency. It uses multiple non-cryptographic hash functions and a bit array to answer whether an element is definitely not in a set or might be in it, making it ideal for quick lookups in caches and network routers. The code focuses on practical tradeoffs between false positives, memory usage, and performance, with support for both standard and counting variants.
