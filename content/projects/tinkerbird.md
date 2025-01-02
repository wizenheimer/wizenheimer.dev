---
title: Client-side vector search written in TypeScript
date: 2024-01-01
tags: [chrome, vector-search, typescript, indexeddb, hnsw]
---

[TinkerBird](https://github.com/wizenheimer/tinkerbird) is a browser native vector database designed for efficient storage and retrieval of high-dimensional vectors (embeddings). It's query engine, written in TypeScript, leverages HNSW (Hierarchical Navigable Small World) indexes for fast vector retrieval. The storage layer utilizes IndexedDB, which could be extended with an lru-cache.