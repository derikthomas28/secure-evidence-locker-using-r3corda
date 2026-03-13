<<<<<<< HEAD
from ai_engine import navigate_legal_query

queries = [
    "my neighbor threatened to kill me",
    "I was cheated in an online transaction",
    "someone broke into my house at night",
    "my husband beats me everyday",
    "someone made a deepfake video of me",
    "I was stabbed with a knife",
    "someone is demanding money or they will reveal my photos",
    "a group of people attacked me on the road",
    "my employee stole company funds",
    "I was falsely accused and a fake FIR was filed against me",
]

for q in queries:
    r = navigate_legal_query(q)
    pm = r["primary_match"]
    related = [s["title"] for s in r.get("related_sections", [])]
    print(f"Q: {q}")
    print(f"   -> {pm['title']} | BNS {pm['bns_section']} | IPC {pm['ipc_section']}")
    if related:
        print(f"   Related: {', '.join(related)}")
    print()
=======
from ai_engine import navigate_legal_query

queries = [
    "my neighbor threatened to kill me",
    "I was cheated in an online transaction",
    "someone broke into my house at night",
    "my husband beats me everyday",
    "someone made a deepfake video of me",
    "I was stabbed with a knife",
    "someone is demanding money or they will reveal my photos",
    "a group of people attacked me on the road",
    "my employee stole company funds",
    "I was falsely accused and a fake FIR was filed against me",
]

for q in queries:
    r = navigate_legal_query(q)
    pm = r["primary_match"]
    related = [s["title"] for s in r.get("related_sections", [])]
    print(f"Q: {q}")
    print(f"   -> {pm['title']} | BNS {pm['bns_section']} | IPC {pm['ipc_section']}")
    if related:
        print(f"   Related: {', '.join(related)}")
    print()
>>>>>>> d2165740c73ef4c6d4a2639a12e4eddbb03146c0
