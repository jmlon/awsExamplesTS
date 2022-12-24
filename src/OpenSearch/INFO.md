# Open Search Service

## Service models: Provisioned OpenSearch Domain vs Serverless

### Provisioned OpenSearch Domain
Indexes held in domains.  
Index data stored in local disks (EBS) - "Hot" storage, fastest, read/write.
Ultrawarm = S3 + Caching. Read-only. Lower cost.
Cold storage = S3, Cheaper, for infrequently accessed data.

Snapshots: 
- Automated: Only for recovery. Stored in S3, no additional cost.
- Manual: For recovery and moving data to other cluster. Stored in S3, standard charges.

### Serverless
On demand, auto-scaling cluster.  
Highly available.  
Indexes held in collections.  

Decoupled indexing and searching units.  
Indexing units ingest input data and store indices on S3.  
Search units operate on the indexes stored on S3 (cached on instances).  

OpenSearch Compute Unit (OCU): Min 2 for indexing, 2 for searching.
First collection -> Creates OCUs, other collections share the same OCUs.
Once started, OCUs are always on, even with no traffic on the endpoint.

Collection types:
- Search (key=index, value=document)
- Time series (no ID per entry)

Serverless has some limitations:  
Scale up, but cannot scale down.

**Ref**  
[OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-overview.html)


## Integration with other services

### Data ingestion
[Logstash Output OpenSearch](https://github.com/opensearch-project/logstash-output-opensearch)  
[Fluentd](https://docs.fluentd.org/output/opensearch)  
Kinesis Data Firehose accepts [OpenSearch as a delivery destination](https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html#create-destination-opensearch-serverless)  



## Pricing

### Domain
Instances: Number of instances, Type of instances (On-Demand / Reserved), Storage (EBS)
Transfer charges: Standard for traffic out of OpenSearch.
plus extra cost for Ultrawarm/Cold storage.


### Serverless
Paid per OpenSearch Compute Unit (OCU): OCU-hours + gp3 storage + S3 storage costs.

[Amazon OpenSearch Service Pricing](https://aws.amazon.com/opensearch-service/pricing/)   



[]()  
[]()  
[]()  
