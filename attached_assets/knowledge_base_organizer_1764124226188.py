#!/usr/bin/env python3
"""
Knowledge Base Organizer
Consolidates multiple transcript files into organized knowledge base
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def extract_key_terms(text, term_list=None):
    """Extract occurrences of key terms from text"""
    if term_list is None:
        # Default procurement/HR/staffing terms
        term_list = [
            'procurement', 'purchase order', 'PO', 'RFP', 'RFQ', 'RFI',
            'ATS', 'applicant tracking', 'HRIS', 'HCM', 'HRMS',
            'contingent workforce', 'VMS', 'MSP', 'staffing',
            'SOW', 'statement of work', 'contractor', 'freelancer',
            'vendor management', 'supplier', 'requisition',
            'time-to-hire', 'cost per hire', 'candidate pipeline',
            'payroll', 'benefits', 'onboarding', 'compliance'
        ]
    
    found_terms = {}
    text_lower = text.lower()
    
    for term in term_list:
        count = text_lower.count(term.lower())
        if count > 0:
            found_terms[term] = count
    
    return found_terms

def analyze_transcript(file_path):
    """Analyze a single transcript file"""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Extract metadata if present
    video_id = None
    url = None
    
    lines = content.split('\n')
    for line in lines[:5]:  # Check first few lines for metadata
        if line.startswith('Video ID:'):
            video_id = line.replace('Video ID:', '').strip()
        elif line.startswith('URL:'):
            url = line.replace('URL:', '').strip()
    
    # Get main text (skip metadata header)
    text_start = content.find('='*40)
    if text_start != -1:
        text = content[text_start:].strip()
    else:
        text = content
    
    # Basic stats
    word_count = len(text.split())
    char_count = len(text)
    
    # Extract key terms
    key_terms = extract_key_terms(text)
    
    return {
        'file': Path(file_path).name,
        'video_id': video_id,
        'url': url,
        'word_count': word_count,
        'char_count': char_count,
        'key_terms': key_terms,
        'text': text
    }

def categorize_by_topic(transcripts):
    """Categorize transcripts by primary topic"""
    categories = {
        'Procurement': ['procurement', 'purchase', 'supplier', 'vendor', 'rfp', 'rfq', 'sourcing'],
        'ATS & Recruitment': ['ats', 'applicant', 'recruitment', 'hiring', 'candidate', 'resume'],
        'HRIS & HR Systems': ['hris', 'hrms', 'hcm', 'payroll', 'benefits', 'employee data'],
        'Contingent Workforce': ['contingent', 'contractor', 'freelancer', 'gig', 'temp', 'agency'],
        'VMS & MSP': ['vms', 'msp', 'vendor management', 'managed service'],
        'Staffing & SOW': ['staffing', 'sow', 'statement of work', 'bill rate', 'markup'],
        'General HR': ['onboarding', 'performance', 'compliance', 'training', 'workforce']
    }
    
    categorized = defaultdict(list)
    
    for transcript in transcripts:
        text_lower = transcript['text'].lower()
        
        # Score each category
        scores = {}
        for category, keywords in categories.items():
            score = sum(text_lower.count(keyword) for keyword in keywords)
            scores[category] = score
        
        # Assign to highest scoring category
        if scores:
            best_category = max(scores, key=scores.get)
            if scores[best_category] > 0:
                categorized[best_category].append(transcript)
            else:
                categorized['Uncategorized'].append(transcript)
        else:
            categorized['Uncategorized'].append(transcript)
    
    return categorized

def create_consolidated_knowledge_base(input_dir, output_file='knowledge_base.md'):
    """Create a consolidated knowledge base from all transcripts"""
    
    # Find all transcript files
    transcript_files = list(Path(input_dir).glob('*.txt'))
    transcript_files = [f for f in transcript_files if not f.name.startswith('_')]
    
    if not transcript_files:
        print(f"No transcript files found in: {input_dir}")
        return
    
    print(f"Analyzing {len(transcript_files)} transcript files...")
    print("-" * 80)
    
    # Analyze all transcripts
    transcripts = []
    for file_path in transcript_files:
        try:
            analysis = analyze_transcript(str(file_path))
            transcripts.append(analysis)
            print(f"✅ Analyzed: {file_path.name}")
        except Exception as e:
            print(f"❌ Error analyzing {file_path.name}: {str(e)}")
    
    print(f"\n📊 Successfully analyzed {len(transcripts)} transcripts")
    
    # Categorize transcripts
    print("\n🏷️  Categorizing by topic...")
    categorized = categorize_by_topic(transcripts)
    
    # Generate consolidated knowledge base
    print(f"\n📝 Creating consolidated knowledge base: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Knowledge Base: Procurement, ATS, HR, HRIS, Staffing & Contingent Workforce\n\n")
        f.write(f"**Generated from {len(transcripts)} video transcripts**\n\n")
        f.write("---\n\n")
        
        # Table of contents
        f.write("## Table of Contents\n\n")
        for category in sorted(categorized.keys()):
            count = len(categorized[category])
            f.write(f"- [{category}](#{category.lower().replace(' ', '-').replace('&', '')}) ({count} transcripts)\n")
        f.write("\n---\n\n")
        
        # Overall statistics
        f.write("## Overview Statistics\n\n")
        total_words = sum(t['word_count'] for t in transcripts)
        total_chars = sum(t['char_count'] for t in transcripts)
        f.write(f"- **Total Transcripts:** {len(transcripts)}\n")
        f.write(f"- **Total Words:** {total_words:,}\n")
        f.write(f"- **Total Characters:** {total_chars:,}\n")
        f.write(f"- **Categories:** {len(categorized)}\n\n")
        
        # Key terms frequency across all transcripts
        f.write("### Most Frequent Key Terms\n\n")
        all_terms = defaultdict(int)
        for transcript in transcripts:
            for term, count in transcript['key_terms'].items():
                all_terms[term] += count
        
        sorted_terms = sorted(all_terms.items(), key=lambda x: x[1], reverse=True)[:20]
        f.write("| Term | Occurrences |\n")
        f.write("|------|-------------|\n")
        for term, count in sorted_terms:
            f.write(f"| {term} | {count} |\n")
        f.write("\n---\n\n")
        
        # Content by category
        for category in sorted(categorized.keys()):
            f.write(f"## {category}\n\n")
            f.write(f"**{len(categorized[category])} transcripts in this category**\n\n")
            
            for idx, transcript in enumerate(categorized[category], 1):
                f.write(f"### {category} - Transcript {idx}\n\n")
                
                if transcript['url']:
                    f.write(f"**Source:** [{transcript['video_id']}]({transcript['url']})\n\n")
                elif transcript['video_id']:
                    f.write(f"**Video ID:** {transcript['video_id']}\n\n")
                else:
                    f.write(f"**File:** {transcript['file']}\n\n")
                
                f.write(f"**Stats:** {transcript['word_count']:,} words | {transcript['char_count']:,} characters\n\n")
                
                if transcript['key_terms']:
                    f.write("**Key Terms Found:** ")
                    terms_str = ", ".join([f"{term} ({count})" for term, count in 
                                          sorted(transcript['key_terms'].items(), 
                                                key=lambda x: x[1], reverse=True)[:10]])
                    f.write(terms_str + "\n\n")
                
                f.write("**Transcript:**\n\n")
                f.write("> " + transcript['text'][:1000].replace('\n', '\n> '))
                if len(transcript['text']) > 1000:
                    f.write("...\n\n")
                    f.write(f"*[Full transcript: {transcript['char_count']:,} characters]*\n\n")
                else:
                    f.write("\n\n")
                
                f.write("---\n\n")
    
    print(f"✅ Knowledge base created: {output_file}")
    
    # Create index file
    index_file = output_file.replace('.md', '_index.txt')
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write("KNOWLEDGE BASE INDEX\n")
        f.write("="*80 + "\n\n")
        
        for category in sorted(categorized.keys()):
            f.write(f"\n{category.upper()} ({len(categorized[category])} transcripts)\n")
            f.write("-"*80 + "\n")
            for transcript in categorized[category]:
                f.write(f"  - {transcript['file']}")
                if transcript['url']:
                    f.write(f" | {transcript['url']}")
                f.write(f" | {transcript['word_count']:,} words\n")
    
    print(f"✅ Index created: {index_file}")
    
    # Print category summary
    print("\n" + "="*80)
    print("CATEGORY SUMMARY")
    print("="*80)
    for category in sorted(categorized.keys()):
        count = len(categorized[category])
        total_words = sum(t['word_count'] for t in categorized[category])
        print(f"{category:30} {count:3} transcripts | {total_words:8,} words")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python knowledge_base_organizer.py <transcript_directory>")
        print("\nExample: python knowledge_base_organizer.py transcripts/")
        sys.exit(1)
    
    input_dir = sys.argv[1]
    
    if not os.path.exists(input_dir):
        print(f"Error: Directory '{input_dir}' not found")
        sys.exit(1)
    
    if not os.path.isdir(input_dir):
        print(f"Error: '{input_dir}' is not a directory")
        sys.exit(1)
    
    create_consolidated_knowledge_base(input_dir)
