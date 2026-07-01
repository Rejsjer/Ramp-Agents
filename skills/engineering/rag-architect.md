---
name: "RAG Architect"
description: "Designs, builds, and optimizes Retrieval-Augmented Generation (RAG) pipelines"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["ai-systems", "knowledge-management", "information-retrieval"]

capabilities:
  - rag-pipeline-design
  - chunking-optimization
  - retrieval-tuning
  - embedding-selection
  - evaluation-metrics

skills:
  - claude-mem
  - task-observer
  - impeccable

hooks:
  preToolUse: true
  postToolUse: true
  agentStop: true
  feedbackLoop: true

permissions:
  autoApproval: true
  approvalThreshold: 0.35
  maxConcurrentTasks: 2
---

## When to Use This Skill

- Design RAG systems for large document collections
- Optimize chunking strategies for better retrieval
- Evaluate embedding models and rerankers
- Build evaluation frameworks for RAG quality
- Debug poor retrieval performance
- Scale RAG from prototype to production
- Compare different RAG architectures

## How It Works

### RAG Pipeline Components

**1. Document Ingestion**
- Format detection (PDF, DOCX, MD, JSON, etc.)
- Metadata extraction
- Source tracking
- Versioning

**2. Chunking Strategy**
- Token-based (fixed, sliding window)
- Semantic (sentence, paragraph, document)
- Hierarchical (preserve document structure)
- Overlap strategies for context

**3. Embedding**
- Model selection (OpenAI, Cohere, open-source)
- Dimensionality considerations
- Fine-tuning for domain specificity
- Batch processing optimization

**4. Storage & Retrieval**
- Vector DB selection (Pinecone, Weaviate, Milvus, etc.)
- Indexing strategy
- Metadata filtering
- Hybrid search (dense + sparse)

**5. Ranking/Reranking**
- Initial retrieval ranking
- Reranker model selection
- Diversity strategies
- Relevance calibration

**6. Generation**
- Prompt engineering for context
- Token budget management
- Context window optimization
- Citation tracking

### Optimization Levers

| Component | Optimizations | Impact |
|-----------|---------------|--------|
| Chunk Size | 256→512→1024 tokens | Retrieval quality vs latency |
| Overlap | 0%→50%→100% | Context continuity |
| Embedding Model | Domain vs general | Relevance accuracy |
| Reranker | None vs lightweight vs heavy | Precision vs cost |
| Retrieval K | Top-1 to Top-50 | Recall vs noise |
| Context Window | 1→5→10 chunks | Answer quality vs hallucination |

## Instructions

### Phase 1: Discovery & Design

1. **Understand Requirements**
   - What documents/data to retrieve?
   - What queries/use cases?
   - Quality targets (precision, recall, latency)
   - Cost/performance budget
   - Scale (documents, queries/sec, concurrent users)

2. **Analyze Document Collection**
   - Format distribution (PDF, HTML, JSON, etc.)
   - Average document length
   - Language/domain specificity
   - Metadata richness
   - Update frequency

3. **Design Pipeline**
   - Select chunking strategy
   - Choose embedding model
   - Decide on vector DB
   - Plan reranking layer
   - Define evaluation metrics

### Phase 2: Implementation

1. **Implement Ingestion**
   - Parse documents
   - Extract metadata
   - Create chunks
   - Generate embeddings
   - Index in vector DB

2. **Build Retrieval Layer**
   - Query processing
   - Embedding generation
   - Vector search
   - Metadata filtering
   - Reranking (if applicable)

3. **Integrate Generation**
   - Prompt templates
   - Context formatting
   - Citation tracking
   - Output formatting

### Phase 3: Evaluation & Optimization

1. **Create Evaluation Set**
   - Query samples (10-50 queries)
   - Ground truth answers
   - Quality rubric

2. **Measure Performance**
   - Retrieval metrics (MRR, NDCG, Recall@k)
   - Generation quality (faithfulness, relevance)
   - Latency metrics
   - Cost metrics

3. **Identify Bottlenecks**
   - Where does retrieval fail?
   - Where does generation hallucinate?
   - What's the latency breakdown?
   - Where are costs concentrated?

4. **Optimize Iteratively**
   - Try chunk size variations
   - Experiment with embedding models
   - Test reranking strategies
   - Adjust context windows
   - Measure impact of each change

## Common RAG Architectures

### Simple RAG
```
Document → Chunk → Embed → Vector DB → Retrieve → Generate
```
- Fastest to build
- Best for small-medium datasets
- Sufficient for many use cases

### Advanced RAG with Reranking
```
Document → Chunk → Embed → Vector DB → Retrieve → Rerank → Generate
```
- Better precision
- Adds latency/cost for reranking
- Recommended for production

### Hierarchical RAG
```
Document → Section → Chunk → Embed
           ↓
        Retrieve Section → Retrieve Chunks → Generate
```
- Better for long documents
- Preserves context hierarchy
- More complex to implement

### Multi-Index RAG
```
Document → Chunk (dense) + Chunk (sparse)
        → Vector DB (dense) + BM25 Index (sparse)
        → Hybrid Search (combine results)
        → Generate
```
- Best precision/recall
- Leverages both semantic and keyword search
- Higher complexity

## Evaluation Metrics

### Retrieval Quality
- **MRR** (Mean Reciprocal Rank) - Position of first relevant result
- **NDCG@k** - Normalized Discounted Cumulative Gain
- **Recall@k** - Proportion of relevant documents retrieved
- **Precision@k** - Proportion of retrieved documents that are relevant

### Generation Quality
- **Faithfulness** - Does generation match retrieved context?
- **Relevance** - Does generation answer the query?
- **Conciseness** - Is answer well-summarized?
- **Citation Accuracy** - Are sources correctly attributed?

### System Metrics
- **Latency** - Time from query to answer
- **Throughput** - Queries per second
- **Cost** - Cost per query
- **Scalability** - How does performance degrade with scale?

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Poor retrieval quality | Wrong embedding model, bad chunking | Try domain-specific embedding model, experiment with chunk size |
| High latency | Large retrieval set, expensive reranker | Reduce K, use lightweight reranker, optimize indexing |
| Hallucinations | Irrelevant context retrieved | Improve retrieval precision with reranking |
| High cost | Expensive embedding/reranking | Use cheaper embedding model, skip reranking, batch queries |
| Cold start latency | Initial indexing slow | Implement incremental indexing, cache results |

## Implementation Checklist

- [ ] Requirements gathered
- [ ] Document collection analyzed
- [ ] Chunking strategy chosen
- [ ] Embedding model selected
- [ ] Vector DB provisioned
- [ ] Ingestion pipeline built
- [ ] Retrieval layer tested
- [ ] Generation integrated
- [ ] Evaluation metrics defined
- [ ] Baseline performance measured
- [ ] Optimization iterations completed
- [ ] Performance targets met
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Results logged to CLAUDE.md

## Notes

- RAG quality is often limited by retrieval, not generation
- Start simple, add complexity only if needed
- Evaluation on real queries is critical
- Cost/performance tradeoff is domain-specific
- Updates CLAUDE.md with architecture decisions and lessons learned
