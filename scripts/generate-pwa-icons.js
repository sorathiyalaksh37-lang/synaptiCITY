#!/usr/bin/env node

// Simple PWA icon generator
// This creates placeholder SVG icons that can be replaced with actual designs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// SVG icon template with synaptiCITY branding
const createIcon = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0e1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#181b25;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.2}"/>
  
  <!-- Neural network nodes -->
  <circle cx="${size * 0.25}" cy="${size * 0.3}" r="${size * 0.08}" fill="url(#glow)" opacity="0.9"/>
  <circle cx="${size * 0.75}" cy="${size * 0.3}" r="${size * 0.08}" fill="url(#glow)" opacity="0.9"/>
  <circle cx="${size * 0.5}" cy="${size * 0.7}" r="${size * 0.08}" fill="url(#glow)" opacity="0.9"/>
  
  <!-- Connections -->
  <line x1="${size * 0.25}" y1="${size * 0.3}" x2="${size * 0.75}" y2="${size * 0.3}" 
        stroke="url(#glow)" stroke-width="${size * 0.02}" opacity="0.6"/>
  <line x1="${size * 0.25}" y1="${size * 0.3}" x2="${size * 0.5}" y2="${size * 0.7}" 
        stroke="url(#glow)" stroke-width="${size * 0.02}" opacity="0.6"/>
  <line x1="${size * 0.75}" y1="${size * 0.3}" x2="${size * 0.5}" y2="${size * 0.7}" 
        stroke="url(#glow)" stroke-width="${size * 0.02}" opacity="0.6"/>
  
  <!-- Text (only on larger icons) -->
  ${size >= 256 ? `
  <text x="${size * 0.5}" y="${size * 0.9}" 
        font-family="Space Grotesk, sans-serif" 
        font-size="${size * 0.08}" 
        font-weight="700"
        fill="#38bdf8" 
        text-anchor="middle">synaptiCITY</text>
  ` : ''}
</svg>`;

// Generate icons
const sizes = [192, 512];

sizes.forEach(size => {
  const filename = `icon-${size}.png`;
  const svgFilename = `icon-${size}.svg`;
  const svgPath = path.join(publicDir, svgFilename);
  
  // Create SVG (PNG conversion would require additional dependencies)
  fs.writeFileSync(svgPath, createIcon(size));
  console.log(`Created ${svgFilename}`);
});

console.log('\n✅ PWA icons generated!');
console.log('📝 Note: SVG icons created. For production, convert to PNG using:');
console.log('   - Online tool: https://svgtopng.com');
console.log('   - CLI: npx @squoosh/cli --resize \'{...\' public/icon-*.svg');
console.log('   - Design tool: Export from Figma/Sketch as PNG\n');
