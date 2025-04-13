---
title: "Zero Cost Inference"
date: 2025-04-02T02:23:42+05:30
tags: [inference, typescript, transformers.js]
---

![image/png](https://cdn-uploads.huggingface.co/production/uploads/6461bd2d846a6c8c83055a48/576ZghJyhCwxqyDiLbodQ.png)

If you’ve been following the ML space closely, you might’ve come across demos running DeepSeek, Llama 3.2 right inside your browser. The idea is compelling: run models directly in the browser to eliminate API costs, reduce latency, and enable offline capabilities. Tools like Transformers.js show it's technically possible, but let's be honest—the developer experience leaves a lot to be desired.

That's why I built [**TinyLM**](https://tinylm.wizenheimer.dev), a library that brings language models like DeepSeek, Llama 3.2 and embedding models like Nomic, Jina to your browser with an API that actually makes sense.

## **The Problem with Browser based Inference Today**

When I first started experimenting with browser-based models, I quickly found myself drowning in implementation details:

```jsx
// Typical Transformers.js usage
const tokenizer = await AutoTokenizer.from_pretrained("model-name");
const model = await AutoModelForCausalLM.from_pretrained("model-name");

// Tokenize input
const inputs = await tokenizer("Hello, I'm a language model", {
  return_tensors: "pt",
});

// Generate
const outputs = await model.generate(inputs, {
  max_new_tokens: 50,
  do_sample: true,
  temperature: 0.7,
});

// Decode output
const text = await tokenizer.batch_decode(outputs, {
  skip_special_tokens: true,
});
```

All I could think was **No one should have to deal with this**.

Developers don't think in terms of tokenizers, pipelines, or tensors—they just want an API that works. And preferably, one that's similar to what they're already using (say OpenAI)

## **Transformers.js Isn't the Problem**

Let me be clear: Transformers.js is very impressive. The team has done incredible work packaging Transformers and making them available with just an npm install.

While its core is solid, its SDK design is the issue. It mirrors the Python interface, which makes sense for the Python ecosystem but feels foreign to JavaScript developers.

This isn’t simply a matter of "learning a new API." It’s an interface that forces you to think like an ML researcher rather than a web developer. It exposes implementation details that most developers don’t need to understand and shouldn’t need to care about.

## TinyLM

TinyLM provides a simple, OpenAI-compatible API for running language models directly in your browser or Node.js application. Here's the same example from above:

```jsx
import { TinyLM } from "tinylm";

// Create a TinyLM instance
const tiny = new TinyLM();

// Initialize with a model
await tiny.init({
  models: ["HuggingFaceTB/SmolLM2-135M-Instruct"],
});

// Generate text (OpenAI-compatible API)
const response = await tiny.chat.completions.create({
  messages: [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "Hello, I'm a language model" },
  ],
  temperature: 0.7,
  max_tokens: 50,
});
```

That's it. No tokenizers. No tensors. No pipelines. Just a clean API that works like the ones you're already using.

## Under the hood

Behind this simple interface, TinyLM is doing a lot of heavy lifting (or at least attempts to):

- **WebGPU Acceleration:** Automatically detecting and using hardware acceleration when available
- **Model Management**: Handling downloads, caching, and memory management
- **Detailed Progress Tracking:** Providing per-file download progress with ETA and speed metrics
- **Streaming Support**: True token-by-token streaming with low latency
- **Cross-Platform Compatibility**: Working seamlessly in both browser and Node.js environments

TinyLM is built on top of Transformers.js, but abstracts away all the complexity so you can focus on building applications, not wrestling with tensors and tokenizers.

## **Getting Started**

Using TinyLM is straightforward. First, install the library:

```bash
npm install tinylm
# or
yarn add tinylm
```

Basic initialization looks like this:

```jsx
import { TinyLM } from "tinylm";

// Create a TinyLM instance
const tiny = new TinyLM();

// Initialize (optionally preload models)
await tiny.init();
```

**Chat Completions API**

TinyLM implements the OpenAI chat completions API you're probably already familiar with:

```jsx
const response = await tiny.chat.completions.create({
  messages: [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "What is artificial intelligence?" },
  ],
  temperature: 0.7,
  max_tokens: 150,
});
```

Streaming is just as easy:

```jsx
const stream = await tiny.chat.completions.create({
  messages: [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "Tell me a story." },
  ],
  temperature: 0.8,
  max_tokens: 200,
  stream: true,
});

// Process tokens as they arrive
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || "";
  process.stdout.write(content);
}
```

**Embeddings API**

TinyLM also supports generating embeddings with the same OpenAI-compatible API:

```jsx
const result = await tiny.embeddings.create({
  model: "nomic-ai/nomic-embed-text-v1.5",
  input: "Your text string goes here",
});
```

### **Projects: TinyChat and TinyEmbed**

To help you get started, we've built two reference applications:

[**TinyChat**](https://github.com/wizenheimer/tinychat) is a Next.js application that demonstrates building a chat interface with TinyLM, complete with streaming responses, model loading with progress indicators, and parameter adjustments.

![tinychat/png](https://cdn-uploads.huggingface.co/production/uploads/6461bd2d846a6c8c83055a48/EPova_5zg5RcqQt9sXCn-.png)

[**TinyEmbed**](https://github.com/wizenheimer/tinyembed) showcases TinyLM's embedding capabilities with single and batch embedding generation, and more.

![tinyembed/png](https://cdn-uploads.huggingface.co/production/uploads/6461bd2d846a6c8c83055a48/SfoYz-IDibsECKPrFi0d1.png)

Additionally we have references for running TinyLM over [Node JS](https://github.com/wizenheimer/tinylm/tree/main/examples) too.

### Roadmap Ahead

1. **More Models**: Support for a wider range of models, targeting modalities like image and audio, in addition to text.

   1. Text to Speech

      ```jsx
      import fs from "fs";
      import path from "path";
      import { TinyLM } from "tinylm";

      const tiny = new TinyLM();
      const speechFile = path.resolve("./speech.mp3");

      const mp3 = await tiny.audio.speech.create({
        model: "tts-model",
        voice: "alloy",
        input: "Today is a wonderful day to build something people love!",
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(speechFile, buffer);
      ```

   2. Speech to Text

      ```jsx
      import fs from "fs";
      import { TinyLM } from "tinylm";

      const tiny = new TinyLM();

      const transcription = await tiny.audio.transcriptions.create({
        file: fs.createReadStream("/path/to/file/audio.mp3"),
        model: "whisper-model",
      });

      console.log(transcription.text);
      ```

   3. Image Generation

      ```jsx
      import { TinyLM } from "tinylm";
      const tiny = new TinyLM();

      const response = await tiny.images.generate({
        model: "image-model",
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });
      ```

2. **Multiple Backends**: We're working on adding WebLLM/MLC as an alternative backend, which should provide even better performance for certain models, and already offers OpenAI like SDK.

### Contributing

The current tooling around browser based inference feels too complex, too unfamiliar, and at times too focused on achieving api parity rather than application development. TinyLM is a small attempt of mine to fix that or at the very least influence `transformers.js` SDK design.

TinyLM was built in just over a weekend, and is far from done. If you're interested in making ML more accessible to web developers, I'd love to have you contribute. Whether it's reporting bugs, suggesting features, or contributing code, your involvement will help make client-side ML accessible to everyone.

Try it out, build something cool, and let me know what you think!
