# Rose Tattoo: Modern Dime Image Audit Suite

**Rose Tattoo** is Modern Dime’s strict, stylish, and fashion-forward image audit toolkit. It is the official companion to the Bing Bam Boom metadata validator, designed to ensure every article and gallery meets the highest editorial and visual standards.

## What is Rose Tattoo?
Rose Tattoo is a set of scripts and tools for:
- Scanning all articles for required image and gallery fields
- Verifying that all referenced images exist and are non-empty
- Reporting missing, empty, or broken images in both JSON and terminal summaries
- Helping editors, designers, and developers maintain bulletproof visual quality—especially for fashion, culture, and gallery content

## Usage
From your project root, run:

```
node scripts/rose_tattoo/check_article_images.js
```

- See `image_audit_report.json` for a full machine-readable report
- Review the terminal output for a quick editorial summary

## Why Rose Tattoo?
Modern Dime’s brand is built on visual excellence. Rose Tattoo ensures every story, lookbook, and gallery is ready for the spotlight—no missing images, no broken galleries, no surprises. Use it alongside Bing Bam Boom for a complete, enforceable editorial workflow.

---

*For more, see the [bing-bam-boom](https://github.com/MdrnDme/bing-bam-boom) repo for strict JSON/article validation.*
