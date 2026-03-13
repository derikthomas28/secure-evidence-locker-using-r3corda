<<<<<<< HEAD
from ai_engine import navigate_legal_query
import json

test_queries = [
    "Someone pulled my gold chain and ran away",
    "My neighbor is posting lies about me to ruin my reputation",
    "A person threatened me with a gun to give him my money",
    "I saw someone trying to break into a shop at night",
    "Someone cheated me by taking money for a fake job offer",
    "A group of people attacked me in public with sticks",
    "Someone is stalking me and following me everywhere",
    "I received a fake 500 rupee note from a shopkeeper",
    "Someone intentionally damaged my car by throwing stones",
    "A person is claiming to be a government officer and asking for money"
]

print(f"{'Query':<50} | {'Primary Match':<30} | {'Section':<15} | {'Score'}")
print("-" * 110)

for query in test_queries:
    result = navigate_legal_query(query)
    if result["status"] == "match_found":
        primary = result["primary_match"]
        title = primary["title"][:28] + "..." if len(primary["title"]) > 30 else primary["title"]
        section = primary["bns_section"] if primary["bns_section"] != "N/A" else primary["ipc_section"]
        score = primary["relevance_score"]
        print(f"{query[:48]:<50} | {title:<30} | {section:<15} | {score}")
    else:
        print(f"{query[:48]:<50} | {'No Match Found':<30} | {'N/A':<15} | 0")
=======
from ai_engine import navigate_legal_query
import json

test_queries = [
    "Someone pulled my gold chain and ran away",
    "My neighbor is posting lies about me to ruin my reputation",
    "A person threatened me with a gun to give him my money",
    "I saw someone trying to break into a shop at night",
    "Someone cheated me by taking money for a fake job offer",
    "A group of people attacked me in public with sticks",
    "Someone is stalking me and following me everywhere",
    "I received a fake 500 rupee note from a shopkeeper",
    "Someone intentionally damaged my car by throwing stones",
    "A person is claiming to be a government officer and asking for money"
]

print(f"{'Query':<50} | {'Primary Match':<30} | {'Section':<15} | {'Score'}")
print("-" * 110)

for query in test_queries:
    result = navigate_legal_query(query)
    if result["status"] == "match_found":
        primary = result["primary_match"]
        title = primary["title"][:28] + "..." if len(primary["title"]) > 30 else primary["title"]
        section = primary["bns_section"] if primary["bns_section"] != "N/A" else primary["ipc_section"]
        score = primary["relevance_score"]
        print(f"{query[:48]:<50} | {title:<30} | {section:<15} | {score}")
    else:
        print(f"{query[:48]:<50} | {'No Match Found':<30} | {'N/A':<15} | 0")
>>>>>>> d2165740c73ef4c6d4a2639a12e4eddbb03146c0
