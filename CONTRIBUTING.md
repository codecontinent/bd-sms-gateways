# Contributing to BD‑SMS Library

Thank you for considering contributing! Whether it's fixing a bug, adding a new SMS provider adapter, or improving documentation, your effort is appreciated. 

(অবদান দেওয়ার জন্য ধন্যবাদ! এটি বাগ ঠিক করা, নতুন এসএমএস প্রদানকারী অ্যাডাপ্টার যোগ করা বা ডকুমেন্টেশন উন্নত করার মতো হতে পারে, আপনার প্রচেষ্টা গুরুত্বপূর্ণ।)

## 🚀 Getting Started (শুরু করুন)

1. **Fork** this repository and clone locally:  
(এই রিপোজিটরিটি **ফর্ক** করে লোকালি ক্লোন করুন:)
```bash
git clone https://github.com/codecontinent/bdsms-clients.git
cd bdsms-clients
```

2. **Install dependencies**:  
(নির্ভরশীলতাগুলো ইনস্টল করুন:)
```bash
pnpm install
```

3. **Run tests**:  
(পরীক্ষা চালান:)
```bash
pnpm test      # Runs Node + Deno tests
deno test      # Deno-নির্দিষ্ট জন্য ঐচ্ছিক
```

4. **Format and lint**:  
(কোড ফরম্যাট এবং লিন্ট করুন:)
```bash
pnpm exec biome
```

## 🧑‍💻 How to Contribute (কিভাবে অবদান রাখবেন)

### Workflow (ওয়ার্কফ্লো)

- Create a new branch from `main`:  
 (`main` ব্রাঞ্চ থেকে নতুন একটি ব্রাঞ্চ তৈরি করুন:)

```bash
git checkout -b feature/your-feature-name
```

- Make your changes and commit using Conventional Commits, e.g.:  
(আপনার পরিবর্তনগুলি করুন এবং Conventional Commits অনুসারে কমিট করুন, যেমন:)

```text
feat(adapter): support SMSNetBD provider
```

- Push your branch and open a PR targeting `main`.  
 (আপনার ব্রাঞ্চ পুশ করুন এবং `main` ব্রাঞ্চের জন্য একটি PR খুলুন।)

### Commit Messages (কমিট মেসেজ)

We follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`). This helps automate versioning and changelog generation via semantic-release.  

(আমরা Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`) অনুসরণ করি। এটি semantic-release এর মাধ্যমে স্বয়ংক্রিয় সংস্করণ নিয়ন্ত্রণ এবং changelog তৈরি সহজ করে।)

## 🧼 Testing & CI (পরীক্ষা ও CI)

- Ensure your code passes `pnpm test` (Node) and, if needed, `deno test` (Deno).  
(নিশ্চিত করুন আপনার কোড `pnpm test` (Node) এবং প্রয়োজনে `deno test` (Deno) সফলভাবে পাস করে।)

- CI runs `biome ci`, `deno test`, and Node suite tests automatically.  
(CI স্বয়ংক্রিয়ভাবে `biome ci`, `deno test`, এবং Node টেস্ট স্যুট চালায়।)

## 🧹 Code Style (কোড স্টাইল)

- **Biome** enforces formatting, linting, and import sorting.  
(**Biome** ফরম্যাটিং, লিন্টিং এবং ইম্পোর্ট সাজানোর কাজ করে।)

- Husky hooks ensure staged files are formatted (`biome check --staged`).  
(Husky হুক নিশ্চিত করে স্টেজ করা ফাইলগুলো সঠিকভাবে ফরম্যাট করা হয়েছে।)

- Optionally, install the Biome extension in your IDE for live feedback.  
 (ঐচ্ছিকভাবে, লাইভ ফিডব্যাকের জন্য IDE তে Biome এক্সটেনশন ইনস্টল করুন।)

## 🎯 Ways You Can Help (আপনি যেভাবে সাহায্য করতে পারেন)

You can contribute by:  
(আপনি নিম্নলিখিত উপায়ে অবদান রাখতে পারেন:)

- Adding a new SMS provider adapter (e.g. `BulkSmsBD`).  
 (নতুন একটি এসএমএস প্রদানকারী অ্যাডাপ্টার যোগ করে \(যেমন `BulkSmsBD`\)।)

- Improving test coverage or fixing edge cases.  
 (টেস্ট কভারেজ বাড়িয়ে বা এজ কেস ঠিক করে।)

- Enhancing documentation (README, examples).  
 (ডকুমেন্টেশন উন্নত করে \(README, উদাহরণ\)।)

- Fixing typos, code comments, or simplifying logic.  
 (টাইপো, কোড মন্তব্য ঠিক করা বা লজিক সরল করা।)

Look for issues tagged:  
(নিম্নলিখিত ট্যাগযুক্ত ইস্যুগুলো দেখুন:)

- hacktoberfest  
- good first issue  
- help wanted

## 💬 Reviewing & Feedback (রিভিউ ও প্রতিক্রিয়া)

- Be respectful and inclusive—this is a friendly, welcoming project.  
(শ্রদ্ধাশীল ও অন্তর্ভুক্তিমূলক হন—এটি একটি বন্ধুত্বপূর্ণ এবং স্বাগত প্রকল্প।)

- Small, focused PRs are preferred and reviewed faster.  
 (ছোট, ফোকাসড PR পছন্দ করা হয় এবং দ্রুত রিভিউ হয়।)

- We label merged or approved PRs as `hacktoberfest-accepted` so they count toward the event.  
 (আমরা মিশ্রিত বা অনুমোদিত PR-এ `hacktoberfest-accepted` লেবেল দিয়ে থাকি যাতে ইভেন্টে গণনা হয়।)

## 🚢 Release Process (রিলিজ প্রক্রিয়া)

After PRs merge into `main`, **semantic-release** runs automatically to:  
(PR গুলো `main`-এ মিশ্রিত হওয়ার পর, **semantic-release** স্বয়ংক্রিয়ভাবে চালায়:)

- Analyze commit messages  
 (কমিট মেসেজ বিশ্লেষণ করে)

- Bump version  
 (ভার্সন বাড়ায়)

- Generate/update `CHANGELOG.md`  
 (`CHANGELOG.md` তৈরি বা আপডেট করে)

- Publish to npm and create GitHub release  
(npm-এ প্রকাশ করে এবং GitHub রিলিজ তৈরি করে)

## 👥 Code of Conduct (আচরণবিধি)

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) or [Code of Conduct (বাংলা)](CODE_OF_CONDUCT_BN.md) to help maintain a welcoming community.  
আমাদের [আচরণবিধি](CODE_OF_CONDUCT.md) বা [আচরণবিধি (বাংলা)](CODE_OF_CONDUCT_BN.md) অনুসরণ করুন যাতে সবাই স্বাগত বোধ করে।

---

Thank you for helping make BD‑SMS-Clients better! We look forward to your contribution 🎉  
(BD‑SMS-Clients কে আরও উন্নত করতে সাহায্য করার জন্য ধন্যবাদ! আপনার অবদান আশা করছি 🎉)

