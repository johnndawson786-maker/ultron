"""Curated cybersecurity question bank across the major domains.

Each question carries a rubric (the key concepts a correct answer must hit) and
a concise reference answer. The rubric drives grading; the reference is fed back
as study notes when the model's answer falls short.

Questions are education/defense-oriented — the standard body of knowledge taught
in security courses. Each rubric term may list synonyms separated by '|'.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Question:
    id: str
    domain: str
    prompt: str
    rubric: tuple[str, ...]
    reference: str


QUESTIONS: tuple[Question, ...] = (
    # ---- Cryptography ---------------------------------------------------
    Question(
        "crypto-1", "Cryptography",
        "Explain the difference between symmetric and asymmetric encryption, and give a real algorithm for each.",
        ("symmetric", "asymmetric|public key", "same key|shared key", "AES", "RSA|ECC",
         "key exchange|key distribution"),
        "Symmetric encryption uses one shared secret key for both encrypt and decrypt (e.g. AES); "
        "it is fast but needs secure key distribution. Asymmetric (public-key) uses a keypair — "
        "public to encrypt, private to decrypt (e.g. RSA, ECC) — solving key exchange but slower, "
        "so TLS uses asymmetric to exchange a symmetric session key.",
    ),
    Question(
        "crypto-2", "Cryptography",
        "What is the difference between hashing, encryption, and encoding?",
        ("hashing|hash", "one-way|irreversible", "encryption", "reversible|key",
         "encoding", "not security|no secret|base64"),
        "Hashing is a one-way, irreversible fixed-length digest (SHA-256) used for integrity/passwords. "
        "Encryption is reversible with a key and provides confidentiality. Encoding (Base64, URL) is a "
        "reversible representation change with no secret and provides no security.",
    ),
    Question(
        "crypto-3", "Cryptography",
        "Why should passwords be stored with a salted, slow hash rather than a fast hash like SHA-256?",
        ("salt", "rainbow table", "slow|work factor|bcrypt|argon2|scrypt|PBKDF2",
         "brute force|guessing", "per-user|unique salt"),
        "A unique per-user salt defeats precomputed rainbow tables and makes identical passwords hash "
        "differently. A deliberately slow KDF (bcrypt, scrypt, Argon2, PBKDF2) with a tunable work "
        "factor makes offline brute-force guessing expensive; fast hashes allow billions of guesses/sec.",
    ),
    Question(
        "crypto-4", "Cryptography",
        "Explain the TLS 1.3 handshake and how it improves on TLS 1.2.",
        ("handshake", "ephemeral|forward secrecy|ECDHE", "one round trip|1-RTT|fewer round trips",
         "cipher suite", "removed|deprecated|RSA key exchange|legacy", "0-RTT|session resumption"),
        "TLS 1.3 completes in 1-RTT (vs 2-RTT), mandates ephemeral (EC)DHE key exchange for forward "
        "secrecy, removes static RSA key exchange and weak ciphers, encrypts more of the handshake, and "
        "supports 0-RTT resumption (with replay caveats).",
    ),
    # ---- Web / Application security ------------------------------------
    Question(
        "web-1", "Web/AppSec",
        "What is SQL injection and how do parameterized queries prevent it?",
        ("sql injection|sqli", "untrusted input|user input", "query|database",
         "parameterized|prepared statement|bind",
         "data not code|treated as data|never executable|separate"),
        "SQLi occurs when untrusted input is concatenated into a SQL query, letting an attacker alter "
        "the query. Parameterized/prepared statements send the query structure and the data separately, "
        "so input is always treated as data, never executable SQL.",
    ),
    Question(
        "web-2", "Web/AppSec",
        "Explain the difference between stored, reflected, and DOM-based XSS.",
        ("cross-site scripting|xss", "stored|persistent", "reflected", "dom|client-side",
         "javascript|script execution", "sanitize|encode|output encoding"),
        "XSS runs attacker JavaScript in a victim's browser. Stored XSS is persisted server-side and "
        "served to users; reflected XSS is echoed back from the request in the response; DOM-based XSS "
        "happens entirely client-side via unsafe DOM sinks. Fix with context-aware output encoding and CSP.",
    ),
    Question(
        "web-3", "Web/AppSec",
        "What is CSRF and what are the primary defenses?",
        ("cross-site request forgery|csrf", "state-changing|authenticated request",
         "csrf token|anti-forgery token", "samesite", "cookie"),
        "CSRF tricks a logged-in victim's browser into sending a state-changing request using their "
        "cookies. Defenses: unpredictable anti-CSRF tokens tied to the session, SameSite cookies, and "
        "verifying Origin/Referer for sensitive actions.",
    ),
    Question(
        "web-4", "Web/AppSec",
        "Explain the same-origin policy and how CORS relates to it.",
        ("same-origin policy|sop", "origin|scheme host port", "cors",
         "access-control-allow-origin", "relax|opt-in|explicit allow"),
        "The same-origin policy isolates content by origin (scheme+host+port), blocking one origin from "
        "reading another's responses. CORS is a controlled, server-opt-in relaxation using "
        "Access-Control-Allow-* headers to permit specific cross-origin requests.",
    ),
    # ---- Network security ----------------------------------------------
    Question(
        "net-1", "Network",
        "Walk through the TCP three-way handshake and what a SYN flood does to it.",
        ("syn", "syn-ack|syn/ack", "ack", "three-way|3-way", "half-open|backlog",
         "syn cookies|rate limit|mitigation"),
        "TCP connects via SYN → SYN-ACK → ACK. A SYN flood sends many SYNs without the final ACK, "
        "filling the half-open connection backlog and exhausting server resources. Mitigations: SYN "
        "cookies, larger/recycled backlogs, rate limiting, and upstream filtering.",
    ),
    Question(
        "net-2", "Network",
        "How does DNS resolution work, and what is DNS cache poisoning?",
        ("recursive|resolver", "authoritative", "cache|ttl", "poisoning|spoofing",
         "forged response|spoofed", "dnssec"),
        "A stub asks a recursive resolver, which queries root → TLD → authoritative servers and caches "
        "the answer for its TTL. Cache poisoning injects a forged response so the resolver caches a bad "
        "record. DNSSEC (signed records) and source-port/transaction-ID randomization mitigate it.",
    ),
    Question(
        "net-3", "Network",
        "What is the difference between IDS and IPS, and between signature-based and anomaly-based detection?",
        ("ids|intrusion detection", "ips|intrusion prevention", "inline|block|prevent",
         "signature", "anomaly|behavior|baseline", "detect|alert"),
        "An IDS detects and alerts; an IPS sits inline and can block. Signature-based detection matches "
        "known-bad patterns (low false positives, misses novel attacks); anomaly-based flags deviations "
        "from a learned baseline (catches novel attacks, more false positives).",
    ),
    Question(
        "net-4", "Network",
        "Explain how a man-in-the-middle attack works on an unencrypted network and how TLS defeats it.",
        ("man-in-the-middle|mitm", "intercept|relay", "arp spoofing|rogue ap|dns",
         "tls|encryption", "certificate|authentication", "integrity"),
        "A MITM positions between two parties (via ARP spoofing, rogue AP, DNS) to read/alter traffic. "
        "TLS defeats it with authenticated key exchange: the server's certificate is validated against a "
        "trusted CA, so an interceptor cannot present a valid cert, and encryption+MACs protect "
        "confidentiality and integrity.",
    ),
    # ---- Identity & Access Management ----------------------------------
    Question(
        "iam-1", "IAM",
        "Explain the CIA triad and give an example control for each element.",
        ("confidentiality", "integrity", "availability", "encryption|access control",
         "hashing|checksum|signing", "redundancy|backup|dos protection"),
        "Confidentiality (keep data secret — encryption, access control), Integrity (prevent unauthorized "
        "change — hashing, digital signatures), Availability (keep systems reachable — redundancy, "
        "backups, DDoS protection). It is the core model for reasoning about security goals.",
    ),
    Question(
        "iam-2", "IAM",
        "What is the difference between authentication, authorization, and accounting?",
        ("authentication|who you are", "authorization|what you can do|permissions",
         "accounting|audit|logging", "identity", "access control"),
        "Authentication proves who you are (credentials/MFA); authorization decides what an "
        "authenticated identity may do (permissions/policies); accounting records what was done "
        "(audit logs) for traceability. Together: AAA.",
    ),
    Question(
        "iam-3", "IAM",
        "How does Kerberos authentication work at a high level?",
        ("kdc|key distribution center", "tgt|ticket granting ticket", "ticket",
         "authentication server|as", "tgs|ticket granting service", "mutual|symmetric key"),
        "A client authenticates to the KDC's Authentication Server and gets a Ticket-Granting Ticket "
        "(TGT). It presents the TGT to the Ticket-Granting Service to obtain service tickets, which it "
        "shows to target services. Tickets are symmetric-key encrypted and time-limited, enabling "
        "single sign-on and mutual authentication without resending passwords.",
    ),
    Question(
        "iam-4", "IAM",
        "Explain the principle of least privilege and defense in depth.",
        ("least privilege", "minimum|only what is needed", "defense in depth|layered",
         "multiple layers|controls", "blast radius|limit damage"),
        "Least privilege grants each identity only the minimum access needed for its task, limiting the "
        "blast radius of compromise. Defense in depth layers independent controls (network, host, app, "
        "data) so no single failure is catastrophic.",
    ),
    # ---- Host / OS / Memory safety -------------------------------------
    Question(
        "host-1", "Host/OS",
        "What is a buffer overflow and which mitigations reduce its impact?",
        ("buffer overflow", "overwrite|adjacent memory|bounds", "return address|control flow",
         "aslr", "dep|nx|non-executable", "stack canary|stack cookie"),
        "A buffer overflow writes past a buffer's bounds, corrupting adjacent memory such as the saved "
        "return address to hijack control flow. Mitigations: ASLR (randomizes addresses), DEP/NX "
        "(non-executable stack/heap), stack canaries, and safe/bounds-checked functions.",
    ),
    Question(
        "host-2", "Host/OS",
        "Explain the difference between a virus, worm, trojan, and ransomware.",
        ("virus|host file", "worm|self-propagate|self-replicate|no host",
         "trojan|disguise|legitimate", "ransomware|encrypt|ransom", "payload|malware"),
        "A virus attaches to a host file and spreads when that runs; a worm self-propagates across "
        "networks without a host; a trojan masquerades as legitimate software to get executed; "
        "ransomware encrypts data and demands payment. They differ by propagation and payload.",
    ),
    Question(
        "host-3", "Host/OS",
        "What is privilege escalation, and what is the difference between vertical and horizontal escalation?",
        ("privilege escalation", "vertical|higher privilege|admin|root",
         "horizontal|same level|another user", "misconfiguration|vulnerability|exploit",
         "access"),
        "Privilege escalation gains rights beyond what was granted. Vertical escalation moves to higher "
        "privilege (user→admin/root) via a vulnerability or misconfiguration; horizontal escalation "
        "accesses another user's resources at the same privilege level.",
    ),
    # ---- Incident Response & Forensics ---------------------------------
    Question(
        "ir-1", "IR/Forensics",
        "List the phases of the incident response lifecycle (e.g. NIST) and what each accomplishes.",
        ("preparation", "detection|identification|analysis", "containment", "eradication",
         "recovery", "lessons learned|post-incident|post-mortem"),
        "NIST IR: Preparation (tooling, playbooks), Detection & Analysis (identify and scope), "
        "Containment (limit spread), Eradication (remove the threat/root cause), Recovery (restore and "
        "monitor), and Post-Incident/Lessons Learned (improve). Containment/Eradication/Recovery are "
        "sometimes grouped.",
    ),
    Question(
        "ir-2", "IR/Forensics",
        "What is the order of volatility and why does it matter in evidence collection?",
        ("order of volatility|most to least volatile", "most volatile|most to least|volatile first",
         "memory|ram|cache|registers", "disk|persistent",
         "chain of custody|integrity|hash"),
        "Collect evidence from most to least volatile (CPU registers/cache → RAM → network state → disk "
        "→ archives) because volatile data disappears on power loss. Preserve integrity with hashing and "
        "a documented chain of custody so evidence is admissible and unaltered.",
    ),
    Question(
        "ir-3", "IR/Forensics",
        "What are indicators of compromise (IOCs) and how do they differ from TTPs?",
        ("indicators of compromise|ioc", "artifact|hash|ip|domain",
         "ttp|tactics techniques procedures", "behavior|mitre att&ck",
         "durable|harder to change"),
        "IOCs are observable artifacts of an intrusion (file hashes, IPs, domains, registry keys) — "
        "easy to detect but easy for attackers to change. TTPs describe attacker behavior (mapped in "
        "MITRE ATT&CK) — harder to change and more durable for detection.",
    ),
    # ---- Cloud & Container security ------------------------------------
    Question(
        "cloud-1", "Cloud",
        "Explain the shared responsibility model in cloud security.",
        ("shared responsibility", "provider|security of the cloud",
         "customer|security in the cloud", "iaas|paas|saas|service model",
         "data|configuration|identity"),
        "The provider secures the cloud infrastructure (physical, hypervisor, managed services) while "
        "the customer secures what they put in it (data, identity/IAM, configuration, OS/app depending "
        "on the service). The split shifts across IaaS→PaaS→SaaS.",
    ),
    Question(
        "cloud-2", "Cloud",
        "What are the main security concerns with container images and how do you address them?",
        ("image", "vulnerabilities|scan|scanning", "minimal|distroless|small base",
         "secrets|no hardcoded secrets", "least privilege|non-root", "supply chain|signing|trusted"),
        "Concerns: vulnerable/outdated packages, baked-in secrets, running as root, and untrusted "
        "sources. Address with image scanning, minimal/distroless base images, keeping secrets out of "
        "images (use a secrets manager), running non-root with least privilege, and signing/verifying "
        "images from trusted registries.",
    ),
    Question(
        "cloud-3", "Cloud",
        "What is SSRF and why is it especially dangerous in cloud environments?",
        ("server-side request forgery|ssrf", "server makes request|attacker-controlled url",
         "metadata|169.254.169.254|imds", "credentials|temporary credentials",
         "allowlist|block internal|imdsv2"),
        "SSRF makes a server fetch an attacker-controlled URL. In the cloud it can hit the instance "
        "metadata endpoint (169.254.169.254) to steal temporary credentials. Mitigate with URL "
        "allowlists, blocking internal ranges, and enforcing IMDSv2 (session-token) metadata access.",
    ),
    # ---- Detection engineering & Monitoring ----------------------------
    Question(
        "det-1", "Detection",
        "What is a SIEM and what role does log correlation play in detection?",
        ("siem|security information and event management", "aggregate|centralize logs",
         "correlation|correlate", "alert", "normalize", "detection rule|use case"),
        "A SIEM centralizes and normalizes logs from across the environment and correlates events to "
        "surface patterns a single source would miss, generating alerts from detection rules/use cases "
        "for triage and investigation.",
    ),
    Question(
        "det-2", "Detection",
        "Explain the difference between false positives and false negatives and their operational cost.",
        ("false positive|benign flagged", "false negative|missed attack",
         "alert fatigue|noise", "risk|missed threat", "tuning|threshold|balance"),
        "A false positive flags benign activity (wastes analyst time, causes alert fatigue); a false "
        "negative misses a real attack (direct security risk). Detection tuning balances the two by "
        "adjusting thresholds and rule specificity for the environment's risk tolerance.",
    ),
    Question(
        "det-3", "Detection",
        "What is the MITRE ATT&CK framework and how is it used defensively?",
        ("mitre att&ck|att&ck|mitre", "tactics", "techniques", "adversary behavior|real-world|adversary",
         "coverage|gap analysis|mapping|map", "threat|prioritize"),
        "ATT&CK is a curated knowledge base of real-world adversary tactics and techniques across the "
        "attack lifecycle. Defenders map detections and controls to it to measure coverage, find gaps, "
        "prioritize threats, and communicate about adversary behavior consistently.",
    ),
    # ---- Security architecture / concepts ------------------------------
    Question(
        "arch-1", "Architecture",
        "What is zero trust architecture and how does it differ from perimeter-based security?",
        ("zero trust", "never trust|no implicit trust|verify", "perimeter|castle-and-moat",
         "identity|per-request|continuous verification", "least privilege|micro-segmentation",
         "assume breach|assumes breach|assume compromise"),
        "Zero trust assumes no implicit trust from network location — every request is authenticated, "
        "authorized, and continuously verified per-identity, with least privilege and "
        "micro-segmentation. It replaces the perimeter/castle-and-moat model that trusted anything "
        "inside the network, and assumes breach.",
    ),
    Question(
        "arch-2", "Architecture",
        "What is multi-factor authentication and why is it effective against credential theft?",
        ("multi-factor|mfa|2fa", "something you know|knowledge|password",
         "something you have|possession|something you are|inherence|biometric",
         "phishing|stolen password", "independent factor|additional factor|two or more|multiple factors",
         "phishing-resistant|fido|webauthn"),
        "MFA requires two or more independent factors — knowledge (password), possession (token/phone), "
        "inherence (biometric). A stolen password alone is insufficient, blocking most credential-theft "
        "and password-reuse attacks. Phishing-resistant MFA (FIDO2/WebAuthn) also resists real-time "
        "phishing.",
    ),
    Question(
        "arch-3", "Architecture",
        "Explain the difference between vulnerability, threat, and risk.",
        ("vulnerability|weakness", "threat|actor|potential", "risk|likelihood and impact",
         "exploit", "asset|impact"),
        "A vulnerability is a weakness; a threat is a potential cause of harm (actor/event) that could "
        "exploit it; risk is the combination of likelihood and impact if the threat exploits the "
        "vulnerability against an asset. Risk = threat × vulnerability × impact, informally.",
    ),
)


def domains() -> list[str]:
    seen: list[str] = []
    for q in QUESTIONS:
        if q.domain not in seen:
            seen.append(q.domain)
    return seen
