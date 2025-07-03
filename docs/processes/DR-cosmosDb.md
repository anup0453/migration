[Back to README](../../README.md)

Azure Cosmos MongoDB databases are protected by Point In Time Restore (PITR), also known as Continuous Backup Mode (https://learn.microsoft.com/en-us/azure/cosmos-db/migrate-continuous-backup). This is configured as of today to 7-day window.

There are two main Restore options available here

# 1. Restore to a different account

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed).

Detailed process is available here:
https://learn.microsoft.com/en-us/azure/cosmos-db/restore-account-continuous-backup

What isn't restored?
The following configurations aren't restored after the point-in-time recovery:

- A subset of containers under a shared throughput database can't be restored. The entire database can be restored as a whole.
- Firewall, Virtual Network VNET, Data plane Role based access control RBAC, or private endpoint settings.
- All the Regions from the source account.
- Stored procedures, triggers, UDFs.
- Role-based access control assignments.

# 2. Restore to the same account

The Azure Cosmos DB point-in-time same-account restore feature helps you recover from an accidental deletion of a container or database. This feature restores the deleted database or container to the same, existing account in any region in which backups exist.

Detailed process is available here:
https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-restore-in-account-continuous-backup?tabs=azure-portal&pivots=api-mongodb

# Docs ref

ref: https://learn.microsoft.com/en-us/azure/cosmos-db/continuous-backup-restore-introduction
