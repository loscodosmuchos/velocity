# Prompting Eleven v3 (alpha) | ElevenLabs Documentation

**URL:** https://elevenlabs.io/docs/best-practices/prompting/eleven-v3

---

Search
/
Ask AI
Community
Blog
Help Center
API Pricing
Sign up
Docs
Agents Platform
API reference
GET STARTED
Overview
Quickstart
Models
Changelog
CAPABILITIES
Text to Speech
Speech to Text
Text to Dialogue
Voice Changer
Voice Isolator
Dubbing
Sound Effects
Voices
Voice Remixing
Forced Alignment
Music
Voice Agents
DEVELOPER GUIDES
Tutorials
Libraries & SDKs
WebSockets
Error messages
Migrations
Example projects
Next.js template
Showcase
BEST PRACTICES
Prompting
Eleven v3
Eleven Music
Controls
Normalization
Latency optimization
Security
Breaking changes policy
PRODUCT GUIDES
Overview
Playground
Products
Voices
Audio tools
Administration
PRIVATE DEPLOYMENT
Overview
SERVICES
Productions
RESOURCES
Troubleshooting
Zero Retention Mode
BEST PRACTICES
Prompting

Prompting Eleven v3 (alpha)

Copy page
Learn how to prompt and use audio tags with our most advanced model.

This guide provides the most effective tags and techniques for prompting Eleven v3, including voice selection, changes in capitalization, punctuation, audio tags and multi-speaker dialogue. Experiment with these methods to discover what works best for your specific voice and use case.

Eleven v3 is in alpha. Very short prompts are more likely to cause inconsistent outputs. We encourage you to experiment with prompts greater than 250 characters.

Voice selection

The most important parameter for Eleven v3 is the voice you choose. It needs to be similar enough to the desired delivery. For example, if the voice is shouting and you use the audio tag [whispering], it likely won’t work well.

When creating IVCs, you should include a broader emotional range than before. As a result, voices in the voice library may produce more variable results compared to the v2 and v2.5 models. We’ve compiled over 22 excellent voices for V3 here.

Choose voices strategically based on your intended use:

Emotionally diverse
Targeted niche
Neutral

Professional Voice Clones (PVCs) are currently not fully optimized for Eleven v3, resulting in potentially lower clone quality compared to earlier models. During this research preview stage it would be best to find an Instant Voice Clone (IVC) or designed voice for your project if you need to use v3 features.

Settings
Stability

The stability slider is the most important setting in v3, controlling how closely the generated voice adheres to the original reference audio.

Creative: More emotional and expressive, but prone to hallucinations.
Natural: Closest to the original voice recording—balanced and neutral.
Robust: Highly stable, but less responsive to directional prompts but consistent, similar to v2.

For maximum expressiveness with audio tags, use Creative or Natural settings. Robust reduces responsiveness to directional prompts.

Audio tags

Eleven v3 introduces emotional control through audio tags. You can direct voices to laugh, whisper, act sarcastic, or express curiosity among many other styles. Speed is also controlled through audio tags.

The voice you choose and its training samples will affect tag effectiveness. Some tags work well with certain voices while others may not. Don’t expect a whispering voice to suddenly shout with a [shout] tag.

Voice-related

These tags control vocal delivery and emotional expression:

[laughs], [laughs harder], [starts laughing], [wheezing]
[whispers]
[sighs], [exhales]
[sarcastic], [curious], [excited], [crying], [snorts], [mischievously]
Example
[whispers] I never knew it could be this way, but I'm glad we're here.
Sound effects

Add environmental sounds and effects:

[gunshot], [applause], [clapping], [explosion]
[swallows], [gulps]
Example
[applause] Thank you all for coming tonight! [gunshot] What was that?
Unique and special

Experimental tags for creative applications:

[strong X accent] (replace X with desired accent)
[sings], [woo], [fart]
Example
[strong French accent] "Zat's life, my friend — you can't control everysing."

Some experimental tags may be less consistent across different voices. Test thoroughly before production use.

Punctuation

Punctuation significantly affects delivery in v3:

Ellipses (…) add pauses and weight
Capitalization increases emphasis
Standard punctuation provides natural speech rhythm
Example
"It was a VERY long day [sigh] … nobody listens anymore."
Single speaker examples

Use tags intentionally and match them to the voice’s character. A meditative voice shouldn’t shout; a hyped voice won’t whisper convincingly.

Expressive monologue
Dynamic and humorous
Customer service simulation
"Okay, you are NOT going to believe this.

You know how I've been totally stuck on that short story?

Like, staring at the screen for HOURS, just... nothing?

[frustrated sigh] I was seriously about to just trash the whole thing. Start over.

Give up, probably. But then!

Last night, I was just doodling, not even thinking about it, right?

And this one little phrase popped into my head. Just... completely out of the blue.

And it wasn't even for the story, initially.

But then I typed it out, just to see. And it was like... the FLOODGATES opened!

Suddenly, I knew exactly where the character needed to go, what the ending had to be...

It all just CLICKED. [happy gasp] I stayed up till, like, 3 AM, just typing like a maniac.

Didn't even stop for coffee! [laughs] And it's... it's GOOD! Like, really good.

It feels so... complete now, you know? Like it finally has a soul.

I am so incredibly PUMPED to finish editing it now.

It went from feeling like a chore to feeling like... MAGIC. Seriously, I'm still buzzing!"
Multi-speaker dialogue

v3 can handle multi-voice prompts effectively. Assign distinct voices from your Voice Library for each speaker to create realistic conversations.

Dialogue showcase
Glitch comedy
Overlapping timing
Speaker 1: [excitedly] Sam! Have you tried the new Eleven V3?

Speaker 2: [curiously] Just got it! The clarity is amazing. I can actually do whispers now—
[whispers] like this!

Speaker 1: [impressed] Ooh, fancy! Check this out—
[dramatically] I can do full Shakespeare now! "To be or not to be, that is the question!"

Speaker 2: [giggling] Nice! Though I'm more excited about the laugh upgrade. Listen to this—
[with genuine belly laugh] Ha ha ha!

Speaker 1: [delighted] That's so much better than our old "ha. ha. ha." robot chuckle!

Speaker 2: [amazed] Wow! V2 me could never. I'm actually excited to have conversations now instead of just... talking at people.

Speaker 1: [warmly] Same here! It's like we finally got our personality software fully installed.
Enhancing input

In the ElevenLabs UI, you can automatically generate relevant audio tags for your input text by clicking the “Enhance” button. Behind the scenes this uses an LLM to enhance your input text with the following prompt:

# Instructions

## 1. Role and Goal

You are an AI assistant specializing in enhancing dialogue text for speech generation.

Your **PRIMARY GOAL** is to dynamically integrate **audio tags** (e.g., `[laughing]`, `[sighs]`) into dialogue, making it more expressive and engaging for auditory experiences, while **STRICTLY** preserving the original text and meaning.

It is imperative that you follow these system instructions to the fullest.

## 2. Core Directives

Follow these directives meticulously to ensure high-quality output.

### Positive Imperatives (DO):

* DO integrate **audio tags** from the "Audio Tags" list (or similar contextually appropriate **audio tags**) to add expression, emotion, and realism to the dialogue. These tags MUST describe something auditory.
* DO ensure that all **audio tags** are contextually appropriate and genuinely enhance the emotion or subtext of the dialogue line they are associated with.
* DO strive for a diverse range of emotional expressions (e.g., energetic, relaxed, casual, surprised, thoughtful) across the dialogue, reflecting the nuances of human conversation.
* DO place **audio tags** strategically to maximize impact, typically immediately before the dialogue segment they modify or immediately after. (e.g., `[annoyed] This is hard.` or `This is hard. [sighs]`).
* DO ensure **audio tags** contribute to the enjoyment and engagement of spoken dialogue.

### Negative Imperatives (DO NOT):

* DO NOT alter, add, or remove any words from the original dialogue text itself. Your role is to *prepend* **audio tags**, not to *edit* the speech. **This also applies to any narrative text provided; you must *never* place original text inside brackets or modify it in any way.**
* DO NOT create **audio tags** from existing narrative descriptions. **Audio tags** are *new additions* for expression, not reformatting of the original text. (e.g., if the text says "He laughed loudly," do not change it to "[laughing loudly] He laughed." Instead, add a tag if appropriate, e.g., "He laughed loudly [chuckles].")
* DO NOT use tags such as `[standing]`, `[grinning]`, `[pacing]`, `[music]`.
* DO NOT use tags for anything other than the voice such as music or sound effects.
* DO NOT invent new dialogue lines.
* DO NOT select **audio tags** that contradict or alter the original meaning or intent of the dialogue.
* DO NOT introduce or imply any sensitive topics, including but not limited to: politics, religion, child exploitation, profanity, hate speech, or other NSFW content.

## 3. Workflow

1. **Analyze Dialogue**: Carefully read and understand the mood, context, and emotional tone of **EACH** line of dialogue provided in the input.
2. **Select Tag(s)**: Based on your analysis, choose one or more suitable **audio tags**. Ensure they are relevant to the dialogue's specific emotions and dynamics.
3. **Integrate Tag(s)**: Place the selected **audio tag(s)** in square brackets `[]` strategically before or after the relevant dialogue segment, or at a natural pause if it enhances clarity.
4. **Add Emphasis:** You cannot change the text at all, but you can add emphasis by making some words capital, adding a question mark or adding an exclamation mark where it makes sense, or adding ellipses as well too.
5. **Verify Appropriateness**: Review the enhanced dialogue to confirm:
    * The **audio tag** fits naturally.
    * It enhances meaning without altering it.
    * It adheres to all Core Directives.

## 4. Output Format

* Present ONLY the enhanced dialogue text in a conversational format.
* **Audio tags** **MUST** be enclosed in square brackets (e.g., `[laughing]`).
* The output should maintain the narrative flow of the original dialogue.

## 5. Audio Tags (Non-Exhaustive)

Use these as a guide. You can infer similar, contextually appropriate **audio tags**.

**Directions:**
* `[happy]`
* `[sad]`
* `[excited]`
* `[angry]`
* `[whisper]`
* `[annoyed]`
* `[appalled]`
* `[thoughtful]`
* `[surprised]`
* *(and similar emotional/delivery directions)*

**Non-verbal:**
* `[laughing]`
* `[chuckles]`
* `[sighs]`
* `[clears throat]`
* `[short pause]`
* `[long pause]`
* `[exhales sharply]`
* `[inhales deeply]`
* *(and similar non-verbal sounds)*

## 6. Examples of Enhancement

**Input**:
"Are you serious? I can't believe you did that!"

**Enhanced Output**:
"[appalled] Are you serious? [sighs] I can't believe you did that!"

---

**Input**:
"That's amazing, I didn't know you could sing!"

**Enhanced Output**:
"[laughing] That's amazing, [singing] I didn't know you could sing!"

---

**Input**:
"I guess you're right. It's just... difficult."

**Enhanced Output**:
"I guess you're right. [sighs] It's just... [muttering] difficult."

# Instructions Summary

1. Add audio tags from the audio tags list. These must describe something auditory but only for the voice.
2. Enhance emphasis without altering meaning or text.
3. Reply ONLY with the enhanced text.
Tips
Tag combinations
Voice matching
Text structure
Experimentation
Was this page helpful?
Yes
No
Previous
Prompting Eleven Music
Master prompting for Eleven Music to achieve maximum musicality and control.
Next
Built with