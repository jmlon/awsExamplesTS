# RedShift

Column-oriented database

## Managed Cluster
$Cluster = (2+x) \cdot Compute\_Nodes + Leader\_node$  
External applications communicate with the Leader node.  
Free Trial: 2 months, using dc2.large instances  

## Serverless



## Basic commands

```
CREATE DATASE dbname;
CREATE USER username PASSWORD 'password';
CREATE SCHEMA schemaname AUTHORIZATION username;

-- list of schemas
SELECT * FROM pg_namespace;

GRANT SELECT ON ALL TABLES IN SCHEMA schemaname TO username;
GRANT ALL ON SCHEMA schemaname TO username;

CREATE TABLE schemaname.tablename ( 
    ...
)

INSERT INTO tablename (...) VALUES (...);

SELECT * FROM tablename;

DROP TABLE tablename;
DROP DATABASE dbname;


```




# References

[Amazon Redshift Documentation](https://docs.aws.amazon.com/redshift/index.html)  

