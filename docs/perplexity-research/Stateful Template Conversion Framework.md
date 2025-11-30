<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Stateful Template Conversion Framework

**Semantic versioning** follows a three-part structure (X.Y.Z) where Major (X) indicates structural changes, Minor (Y) adds features, and Patch (Z) fixes small issues[^1][^2]. This approach provides clarity for tracking how prompts evolve over time[^1][^2].

### Base Template Structure

```json
{
  "metadata": {
    "name": "universal_research_prompt",
    "version": "1.0.0",
    "created": "2025-10-04T17:33:00Z",
    "author": "user_id",
    "description": "Universal topic research and content gathering",
    "labels": ["production"],
    "changelog": "Initial release"
  },
  "state": {
    "topic": "{{TOPIC}}",
    "output_type": "{{TYPE}}",
    "depth_level": "{{DEPTH}}",
    "token_budget": "{{BUDGET}}",
    "sections_completed": [],
    "topic_mention_count": 0,
    "drift_score": 0,
    "last_checkpoint": null
  },
  "config": {
    "max_sections": 10,
    "min_topic_mentions_per_section": 5,
    "drift_threshold": 0.65,
    "enable_validation": true,
    "compression_mode": "extractive"
  },
  "prompt_template": {
    "system": "[ACTIVE_STATE]\nT: {{topic}}\nDepth: {{depth_level}}\nMode: {{output_type}}\nBudget: {{token_budget}} tokens\n[CONSTRAINTS]\n- Every section must reference T at least {{config.min_topic_mentions_per_section}} times\n- Maintain drift_score > {{config.drift_threshold}}\n- Update state after each section\n\n[INSTRUCTIONS]\n{{instructions}}",
    "sections": [],
    "validation": "After each section:\n1. Count T mentions\n2. Calculate semantic similarity to original topic\n3. Update state object\n4. If drift > threshold, regenerate section"
  }
}
```

**Token efficiency**: This JSON structure enables programmatic validation and automated state tracking while consuming only 250-300 tokens for metadata overhead[^3][^4].

## Conversion Process: Original Prompt → Stateful Template

### Step 1: Extract Core Components

**Original prompt analysis**:

- Identify fixed instruction patterns
- Mark variable elements with `{{placeholders}}`
- Separate configuration from content
- Define state requirements[^1][^3]

**Example transformation**:

```
BEFORE: "You're a multi-disciplinary expert researching [TOPIC]..."
AFTER: 
  system: "You're a {{expertise_level}} expert researching {{topic}}..."
  state: {"topic": null, "expertise_level": "multi-disciplinary"}
```


### Step 2: Add State Management Layer

```python
# state_manager.py
class PromptState:
    def __init__(self, template_version):
        self.template_version = template_version
        self.execution_state = {
            "current_section": 0,
            "sections_completed": [],
            "topic_mentions": {},
            "drift_scores": [],
            "rollback_points": []
        }
    
    def update(self, section_id, metrics):
        """Update state after each section generation"""
        self.execution_state["current_section"] = section_id
        self.execution_state["sections_completed"].append(section_id)
        self.execution_state["topic_mentions"][section_id] = metrics["mentions"]
        self.execution_state["drift_scores"].append(metrics["drift"])
        
        # Create rollback point if quality threshold met
        if metrics["drift"] > 0.7 and metrics["mentions"] >= 5:
            self.execution_state["rollback_points"].append({
                "section": section_id,
                "timestamp": datetime.now().isoformat(),
                "state_snapshot": copy.deepcopy(self.execution_state)
            })
    
    def get_context_for_next_section(self):
        """Generate context injection for next section"""
        last_section = self.execution_state["sections_completed"][-1]
        avg_drift = np.mean(self.execution_state["drift_scores"])
        
        return f"""[CONTEXT_CARRYFORWARD]
Last: {last_section}
Avg_Drift: {avg_drift:.2f}
T_mentions_total: {sum(self.execution_state["topic_mentions"].values())}
Status: {'on_track' if avg_drift > 0.65 else 'needs_refocus'}"""
```

**State persistence** enables recovery from failures and maintains topic coherence across long generations[^5][^6].

### Step 3: Implement Versioning System

```python
# version_manager.py
import hashlib
import json
from datetime import datetime

class PromptVersionManager:
    def __init__(self, base_path="./prompts"):
        self.base_path = base_path
        self.version_registry = {}
    
    def create_version(self, template_data, version_type="patch"):
        """Create new version following SemVer"""
        current = self._parse_version(template_data["metadata"]["version"])
        
        if version_type == "major":
            new_version = (current[^0] + 1, 0, 0)
        elif version_type == "minor":
            new_version = (current[^0], current[^1] + 1, 0)
        else:  # patch
            new_version = (current[^0], current[^1], current[^2] + 1)
        
        template_data["metadata"]["version"] = f"{new_version[^0]}.{new_version[^1]}.{new_version[^2]}"
        template_data["metadata"]["created"] = datetime.now().isoformat()
        
        # Generate content hash for integrity verification
        content_hash = self._generate_hash(template_data)
        template_data["metadata"]["content_hash"] = content_hash
        
        return template_data
    
    def save_version(self, template_data, labels=None):
        """Save versioned template with optional labels"""
        version = template_data["metadata"]["version"]
        name = template_data["metadata"]["name"]
        
        # Save to version-specific file
        filename = f"{self.base_path}/{name}_v{version}.json"
        with open(filename, 'w') as f:
            json.dump(template_data, f, indent=2)
        
        # Update registry
        if labels:
            template_data["metadata"]["labels"] = labels
            self._update_label_registry(name, version, labels)
        
        return filename
    
    def get_version(self, name, version=None, label=None):
        """Retrieve specific version or by label"""
        if label:
            version = self._resolve_label(name, label)
        
        if version is None:
            version = self._resolve_label(name, "production")
        
        filename = f"{self.base_path}/{name}_v{version}.json"
        with open(filename, 'r') as f:
            return json.load(f)
    
    def rollback(self, name, target_version):
        """Rollback by updating production label"""
        self._update_label_registry(name, target_version, ["production"])
        return self.get_version(name, version=target_version)
    
    def diff_versions(self, name, v1, v2):
        """Generate diff between two versions"""
        template1 = self.get_version(name, version=v1)
        template2 = self.get_version(name, version=v2)
        
        changes = {
            "metadata_changes": self._compare_dicts(
                template1["metadata"], 
                template2["metadata"]
            ),
            "state_changes": self._compare_dicts(
                template1["state"], 
                template2["state"]
            ),
            "prompt_changes": self._compare_dicts(
                template1["prompt_template"], 
                template2["prompt_template"]
            )
        }
        return changes
    
    def _generate_hash(self, data):
        """Generate SHA-256 hash of prompt content"""
        content = json.dumps(data["prompt_template"], sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:12]
```

**Version control** enables tracking changes systematically, rolling back problematic updates, and maintaining audit trails[^1][^3].

## Complete Stateful Template Example

```json
{
  "metadata": {
    "name": "universal_topic_research",
    "version": "2.1.3",
    "created": "2025-10-04T17:33:00Z",
    "author": "silicon_valley_pro",
    "description": "Multi-domain research with state preservation",
    "labels": ["production", "itad-research"],
    "content_hash": "a3f8d2e9c1b4",
    "changelog": "Added extractive compression, improved topic anchoring",
    "parent_version": "2.1.2",
    "performance_metrics": {
      "avg_topic_coherence": 0.87,
      "avg_drift_score": 0.72,
      "token_efficiency": 0.65
    }
  },
  "state": {
    "topic": "{{TOPIC}}",
    "output_type": "{{TYPE|default:comprehensive_guide}}",
    "depth_level": "{{DEPTH|default:3}}",
    "token_budget": "{{BUDGET|default:5000}}",
    "sections_completed": [],
    "topic_mentions": {},
    "drift_scores": [],
    "checkpoint_data": null,
    "error_count": 0,
    "regeneration_triggers": []
  },
  "config": {
    "max_sections": 10,
    "min_topic_mentions_per_section": 5,
    "drift_threshold": 0.65,
    "enable_validation": true,
    "compression_mode": "extractive",
    "checkpoint_frequency": 3,
    "auto_rollback_on_drift": true,
    "max_regeneration_attempts": 2
  },
  "prompt_template": {
    "system": "[TEMPLATE_v2.1.3] [STATE_TRACKING_ENABLED]\n\n[PRIMARY_FOCUS]\nT: {{topic}}\nDepth: {{depth_level}}/5\nMode: {{output_type}}\nBudget: {{token_budget}} tokens\n\n[OPERATIONAL_CONSTRAINTS]\n- Reference T minimum {{config.min_topic_mentions_per_section}}x per section\n- Maintain semantic similarity > {{config.drift_threshold}}\n- Update execution_state after each §\n- Auto-checkpoint every {{config.checkpoint_frequency}} sections\n\n{{#if state.checkpoint_data}}\n[CONTEXT_RESTORATION]\nResuming from: §{{state.checkpoint_data.section_id}}\nLast key points: {{state.checkpoint_data.summary}}\nCurrent T-mentions: {{state.checkpoint_data.total_mentions}}\n{{/if}}\n\n[INSTRUCTIONS]\nGenerate comprehensive research on {{topic}} following these domain sections:\n{{#each sections}}\n§{{@index}} {{this.title}}: {{this.focus}}\n{{/each}}\n\nAfter EACH section, output:\n[STATE_UPDATE]\n{\n  \"section\": §{{@index}},\n  \"t_mentions\": <count>,\n  \"drift\": <0-1 score>,\n  \"key_terms\": [\"term1\", \"term2\"],\n  \"summary\": \"<2-sentence recap>\"\n}",
    "sections": [
      {
        "id": "s1",
        "title": "Essence & Context",
        "focus": "Core definition, relevance, primary uses of {{topic}}",
        "token_allocation": 500,
        "required_elements": ["definition", "relevance", "applications"]
      },
      {
        "id": "s2",
        "title": "Historical Evolution",
        "focus": "Origin, key milestones, major figures in {{topic}}",
        "token_allocation": 600,
        "required_elements": ["timeline", "milestones", "key_figures"]
      },
      {
        "id": "s3",
        "title": "Technical Dimensions",
        "focus": "Scientific/technical aspects of {{topic}}",
        "token_allocation": 700,
        "required_elements": ["mechanisms", "innovations", "technical_details"]
      },
      {
        "id": "s4",
        "title": "Cross-Domain Patterns",
        "focus": "How {{topic}} appears across culture/nature/tech",
        "token_allocation": 600,
        "required_elements": ["cultural", "natural_analogs", "tech_integration"]
      },
      {
        "id": "s5",
        "title": "Edge Cases & Black Swans",
        "focus": "Extreme scenarios, disruptions, future possibilities for {{topic}}",
        "token_allocation": 700,
        "required_elements": ["extreme_cases", "disruptions", "future_scenarios"]
      }
    ],
    "validation": {
      "per_section": "1. Extract T mentions\n2. Calculate embedding similarity to original {{topic}}\n3. Check required_elements presence\n4. If drift < {{config.drift_threshold}} → regenerate with stronger anchor",
      "checkpoint_trigger": "if (sections_completed % {{config.checkpoint_frequency}} == 0) { create_checkpoint() }",
      "final": "Generate coherence heatmap + topic density visualization"
    }
  },
  "execution_history": [
    {
      "execution_id": "exec_20251004_001",
      "topic": "precious_metals_refining_itad",
      "timestamp": "2025-10-04T14:22:00Z",
      "template_version": "2.1.3",
      "performance": {
        "avg_drift": 0.76,
        "total_tokens": 4850,
        "sections_regenerated": 1,
        "completion_time_seconds": 42
      }
    }
  ]
}
```


## HTML Generator Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Stateful Prompt Generator v2.1</title>
    <script src="prompt_version_manager.js"></script>
</head>
<body>
    <h1>Stateful Template Generator</h1>
    
    <!-- Topic Input -->
    <label>Topic:</label>
    <input type="text" id="topic" placeholder="Enter research topic">
    
    <!-- Template Selection -->
    <label>Template Version:</label>
    <select id="template_version">
        <option value="2.1.3" selected>v2.1.3 (Production)</option>
        <option value="2.1.2">v2.1.2 (Staging)</option>
        <option value="2.0.0">v2.0.0 (Legacy)</option>
    </select>
    
    <!-- Configuration -->
    <label>Depth Level (1-5):</label>
    <input type="range" id="depth" min="1" max="5" value="3">
    
    <label>Token Budget:</label>
    <input type="number" id="budget" value="5000">
    
    <!-- State Management -->
    <div id="state_display" style="display:none;">
        <h3>Current State</h3>
        <pre id="state_json"></pre>
        <button onclick="saveCheckpoint()">Save Checkpoint</button>
        <button onclick="loadCheckpoint()">Load Last Checkpoint</button>
    </div>
    
    <!-- Version Control Actions -->
    <h3>Version Control</h3>
    <button onclick="createNewVersion('patch')">Create Patch (Bug Fix)</button>
    <button onclick="createNewVersion('minor')">Create Minor (New Feature)</button>
    <button onclick="createNewVersion('major')">Create Major (Breaking Change)</button>
    <button onclick="showDiff()">Compare Versions</button>
    <button onclick="rollback()">Rollback to Previous</button>
    
    <!-- Output -->
    <button onclick="generatePrompt()">Generate Stateful Prompt</button>
    <div id="output"></div>
    
    <script>
        let versionManager = new PromptVersionManager();
        let currentState = null;
        
        async function generatePrompt() {
            const topic = document.getElementById('topic').value;
            const version = document.getElementById('template_version').value;
            const depth = document.getElementById('depth').value;
            const budget = document.getElementById('budget').value;
            
            // Load template
            const template = await versionManager.getVersion('universal_topic_research', version);
            
            // Initialize state
            currentState = {
                ...template.state,
                topic: topic,
                depth_level: depth,
                token_budget: budget,
                execution_id: generateExecutionId(),
                start_time: new Date().toISOString()
            };
            
            // Substitute variables
            let prompt = template.prompt_template.system
                .replace(/\{\{topic\}\}/g, topic)
                .replace(/\{\{depth_level\}\}/g, depth)
                .replace(/\{\{token_budget\}\}/g, budget)
                .replace(/\{\{config\.(\w+)\}\}/g, (match, key) => template.config[key]);
            
            // Display
            document.getElementById('output').innerHTML = `
                <h3>Generated Prompt (v${version})</h3>
                <pre>${prompt}</pre>
                <h4>State Object</h4>
                <pre>${JSON.stringify(currentState, null, 2)}</pre>
            `;
            
            document.getElementById('state_display').style.display = 'block';
            document.getElementById('state_json').textContent = JSON.stringify(currentState, null, 2);
        }
        
        function saveCheckpoint() {
            localStorage.setItem('prompt_checkpoint', JSON.stringify({
                state: currentState,
                timestamp: new Date().toISOString()
            }));
            alert('Checkpoint saved!');
        }
        
        function loadCheckpoint() {
            const checkpoint = JSON.parse(localStorage.getItem('prompt_checkpoint'));
            if (checkpoint) {
                currentState = checkpoint.state;
                document.getElementById('topic').value = currentState.topic;
                document.getElementById('state_json').textContent = JSON.stringify(currentState, null, 2);
                alert(`Checkpoint loaded from ${checkpoint.timestamp}`);
            }
        }
        
        async function createNewVersion(type) {
            const template = await versionManager.getVersion('universal_topic_research');
            const newTemplate = versionManager.createVersion(template, type);
            
            // Prompt for changelog
            const changelog = prompt('Describe changes:');
            newTemplate.metadata.changelog = changelog;
            
            versionManager.saveVersion(newTemplate, ['staging']);
            alert(`Created version ${newTemplate.metadata.version}`);
        }
        
        async function showDiff() {
            const v1 = prompt('First version (e.g., 2.1.2):');
            const v2 = prompt('Second version (e.g., 2.1.3):');
            const diff = await versionManager.diffVersions('universal_topic_research', v1, v2);
            
            document.getElementById('output').innerHTML = `
                <h3>Diff: v${v1} → v${v2}</h3>
                <pre>${JSON.stringify(diff, null, 2)}</pre>
            `;
        }
        
        async function rollback() {
            const target = prompt('Rollback to version:');
            await versionManager.rollback('universal_topic_research', target);
            alert(`Rolled back production to v${target}`);
            location.reload();
        }
        
        function generateExecutionId() {
            return 'exec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
    </script>
</body>
</html>
```


## Best Practices Implementation Checklist

**Documentation requirements**:

- Record rationale for each version change[^1][^5]
- Track performance metrics (drift scores, token efficiency, completion rates)[^2][^5]
- Maintain changelog with specific improvements documented[^1][^2]

**Access control standards**:

- Define roles: viewers (read-only), members (create versions), admins (deploy to production)[^3]
- Protect production labels from unauthorized changes[^3]
- Implement approval workflows for major version releases[^5][^7]

**Testing protocols**:

- Baseline test each version against known topics[^5]
- A/B test production vs staging versions[^8][^9]
- Monitor drift scores across 10+ executions before production deployment[^5]

This conversion framework transforms static prompts into **versioned, stateful systems** with automated quality tracking, rollback capabilities, and execution history—essential for enterprise-scale prompt operations where consistency and auditability are critical[^1][^5][^7].
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21]</span>

<div align="center">⁂</div>

[^1]: https://latitude-blog.ghost.io/blog/prompt-versioning-best-practices/

[^2]: https://www.getmaxim.ai/articles/prompt-versioning-and-its-best-practices-2025/

[^3]: https://langfuse.com/docs/prompt-management/features/prompt-version-control

[^4]: https://www.digitalocean.com/community/tutorials/context-engineering-moving-beyond-prompting-ai

[^5]: https://www.featbit.co/articles2025/importance-of-prompt-versioning-2025/

[^6]: https://zbrain.ai/building-stateful-agents-with-zbrain/

[^7]: https://launchdarkly.com/blog/prompt-versioning-and-management/

[^8]: https://blog.promptlayer.com/5-best-tools-for-prompt-versioning/

[^9]: https://mirascope.com/blog/prompt-versioning

[^10]: https://www.reddit.com/r/PromptEngineering/comments/1j6g3lz/prompt_management_creating_and_versioning_prompts/

[^11]: https://playingaws.com/posts/effective-prompt-management-in-amazon-bedrock/

[^12]: https://langchain-ai.github.io/langgraph/tutorials/chatbots/information-gather-prompting/

[^13]: https://agenta.ai/blog/the-definitive-guide-to-prompt-management-systems

[^14]: https://zapier.com/blog/ai-prompt-templates/

[^15]: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/prompt-design-strategies

[^16]: https://www.reddit.com/r/PromptEngineering/comments/1lgypxa/prompti_built_a_stateful_dualpersona_ai_tutor/

[^17]: https://www.prompts.ai/en/blog/best-tools-for-keeping-your-ai-prompts-organized-and-versioned

[^18]: https://www.reddit.com/r/LangChain/comments/18rb334/any_good_prompt_management_versioning_tools_out/

[^19]: https://python.langchain.com/docs/concepts/prompt_templates/

[^20]: https://www.salesforceben.com/understanding-ai-grounding-linking-prompt-templates-to-salesforce-data/

[^21]: https://www.promptingguide.ai/introduction/examples

