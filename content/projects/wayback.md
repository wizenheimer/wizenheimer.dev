---
title: A minimalist engine for keeping tabs on your competitor
date: 2024-12-12
tags: [cloudflare, typescript, puppeteer, competitor-tracking]
---

[Wayback](https://github.com/wizenheimer/wayback) is a minimalist engine for keeping tabs on your competitors, built entirely with Cloudflare's edge network.  It captures website changes, analyzes differences, and provides structured data about how sites evolve over time. The entire project runs on Cloudflare's edge network, using Workers for compute, R2 for storage, D1 for data, Queue, Workflow and Cron for queueing and workflow management. We built it to be small, focused, and easy to understand.