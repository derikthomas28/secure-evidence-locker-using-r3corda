"""
Legal Knowledge Base - Unified Module
Combines all BNS/IPC sections from Part 1 and Part 2.
"""

from legal_data_part1 import SECTIONS_PART1
from legal_data_part2 import SECTIONS_PART2, FUNDAMENTAL_RIGHTS

# Merge all sections into one list
LEGAL_SECTIONS = SECTIONS_PART1 + SECTIONS_PART2
