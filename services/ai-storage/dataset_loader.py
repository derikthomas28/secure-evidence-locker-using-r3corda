import csv
import os
import re

def load_bns_dataset(file_path):
    """
    Parses bns_sections.csv
    Columns: Chapter, Chapter_name, Chapter_subtype, Section, Section _name, Description
    """
    sections = []
    if not os.path.exists(file_path):
        print(f"BNS dataset not found at {file_path}")
        return sections

    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sections.append({
                "title": row.get("Section _name", "Untitled Section"),
                "bns": row.get("Section", "N/A"),
                "ipc": "N/A", # Need mapping or just let them be separate
                "desc": row.get("Description", ""),
                "chapter": row.get("Chapter_name", ""),
                "dataset": "BNS"
            })
    return sections

def load_ipc_dataset(file_path):
    """
    Parses FIR_DATASET.csv
    Columns: URL, Description, Offense, Punishment, Cognizable, Bailable, Court
    """
    sections = []
    if not os.path.exists(file_path):
        print(f"IPC dataset not found at {file_path}")
        return sections

    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Extract section number from URL if possible
            # e.g. https://lawrato.com/indian-kanoon/ipc/section-140
            url = row.get("URL", "")
            section_match = re.search(r'section-(\d+[A-Z]*)', url)
            section_num = section_match.group(1) if section_match else "N/A"
            
            sections.append({
                "title": row.get("Offense", "Untitled Offense"),
                "ipc": section_num,
                "bns": "N/A",
                "desc": row.get("Description", ""),
                "punishment": row.get("Punishment", "Contact Legal Expert"),
                "metadata": {
                    "cognizable": row.get("Cognizable", ""),
                    "bailable": row.get("Bailable", ""),
                    "court": row.get("Court", "")
                },
                "dataset": "IPC"
            })
    return sections

def get_combined_dataset(bns_path, ipc_path):
    bns_data = load_bns_dataset(bns_path)
    ipc_data = load_ipc_dataset(ipc_path)
    return bns_data + ipc_data
