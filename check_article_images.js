// check_article_images.js
// Scans all article JSON files for image/image_gallery fields, checks if referenced images exist and are non-empty, and reports issues.

const fs = require('fs');
const path = require('path');

// Use project root instead of __dirname for data paths
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(PROJECT_ROOT, 'data', 'articles');
const IMAGE_DIR = path.join(PROJECT_ROOT, 'data', 'images');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'image_audit_report.json');

function getAllJsonFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

function checkImageExists(imagePath) {
  try {
    const stat = fs.statSync(imagePath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
}

function auditArticleImages() {
  const report = [];
  const articleFiles = getAllJsonFiles(ARTICLES_DIR);
  for (const file of articleFiles) {
    const relFile = path.relative(process.cwd(), file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      report.push({ file: relFile, error: 'Invalid JSON' });
      continue;
    }
    // Check for image fields
    let issues = [];
    if (data.image) {
      const imgPath = path.join(IMAGE_DIR, data.image);
      if (!checkImageExists(imgPath)) {
        issues.push(`Missing or empty image: ${data.image}`);
      }
    }
    if (Array.isArray(data.image_gallery)) {
      data.image_gallery.forEach(img => {
        const imgPath = path.join(IMAGE_DIR, img);
        if (!checkImageExists(imgPath)) {
          issues.push(`Missing or empty gallery image: ${img}`);
        }
      });
    }
    if (!data.image && !data.image_gallery) {
      issues.push('No image or image_gallery field');
    }
    if (issues.length > 0) {
      report.push({ file: relFile, issues });
    }
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Summary section
  const totalArticles = articleFiles.length;
  const issuesCount = report.length;
  const okCount = totalArticles - issuesCount;
  const issueTypeCounts = {};
  report.forEach(entry => {
    (entry.issues || []).forEach(issue => {
      issueTypeCounts[issue] = (issueTypeCounts[issue] || 0) + 1;
    });
  });
  const mostCommonIssue = Object.entries(issueTypeCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (issuesCount === 0) {
    console.log('All articles have valid images.');
  } else {
    console.log('Image audit issues:');
    report.forEach(entry => {
      console.log(`- ${entry.file}`);
      (entry.issues || []).forEach(issue => console.log(`    • ${issue}`));
    });
    console.log(`\nFull report written to ${OUTPUT_FILE}`);
  }
  // Bing Bam Boom style summary
  console.log('\n===== IMAGE AUDIT SUMMARY =====');
  console.log(`Total articles checked: ${totalArticles}`);
  console.log(`Articles with image issues: ${issuesCount}`);
  console.log(`Articles with no image issues: ${okCount}`);
  if (mostCommonIssue) {
    console.log(`Most common issue: "${mostCommonIssue[0]}" (${mostCommonIssue[1]} occurrences)`);
  }
  console.log('==============================\n');
}

auditArticleImages();
