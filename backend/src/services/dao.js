const { MongoClient } = require('mongodb');

class TruthDAO {
    constructor() {
        this.collection = null;
        this.memoryCases = [];
    }

    async initialize(db) {
        if (db) {
            this.collection = db.collection('dao_cases');
        } else {
            console.log("TruthDAO using in-memory mode.");
        }
    }

    // Escalate a case to DAO vote
    async escalateCase(query, analysis, initialScore) {
        const caseData = {
            query,
            analysis,
            initialScore,
            status: 'pending',
            votes: [],
            createdAt: new Date(),
            votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };

        if (!this.collection) {
            caseData._id = Date.now().toString();
            this.memoryCases.push(caseData);
            return caseData._id;
        }

        const result = await this.collection.insertOne(caseData);
        return result.insertedId;
    }

    // Submit a vote
    async submitVote(caseId, voterAddress, vote, reasoning) {
        if (!this.collection) {
            const caseStrId = caseId.toString();
            const existingCase = this.memoryCases.find(c => c._id === caseStrId);
            if (!existingCase) throw new Error("Case not found");

            if (existingCase.votes.some(v => v.voterAddress === voterAddress)) {
                throw new Error("User has already voted on this case");
            }
            const vote_data = {
                voterAddress,
                vote,
                reasoning,
                timestamp: new Date(),
                stake: 10
            };
            existingCase.votes.push(vote_data);
            if (existingCase.votes.length >= 10) {
                await this.resolveCase(caseId);
            }
            return;
        }

        // normal db logic
        const existingCase = await this.collection.findOne({
            _id: caseId,
            "votes.voterAddress": voterAddress
        });

        if (existingCase) {
            throw new Error("User has already voted on this case");
        }

        const vote_data = {
            voterAddress,
            vote, // 'true' or 'false'
            reasoning,
            timestamp: new Date(),
            stake: 10 // Proof of Stake (Simulated until Blockchain sync)
        };

        await this.collection.updateOne(
            { _id: caseId },
            { $push: { votes: vote_data } }
        );

        // Check if voting threshold is met (e.g., 10 votes)
        const case_doc = await this.collection.findOne({ _id: caseId });
        if (case_doc.votes.length >= 10) {
            await this.resolveCase(caseId);
        }
    }

    // Resolve case based on majority vote
    async resolveCase(caseId) {
        if (!this.collection) {
            const caseStrId = caseId.toString();
            const case_doc = this.memoryCases.find(c => c._id === caseStrId);
            if (!case_doc) return;

            const trueVotes = case_doc.votes.filter(v => v.vote === 'true').length;
            const falseVotes = case_doc.votes.filter(v => v.vote === 'false').length;
            const finalVerdict = trueVotes > falseVotes ? 'true' : 'false';
            const consensusScore = Math.round((Math.max(trueVotes, falseVotes) / Math.max(case_doc.votes.length, 1)) * 100);

            case_doc.status = 'resolved';
            case_doc.finalVerdict = finalVerdict;
            case_doc.consensusScore = consensusScore;
            case_doc.resolvedAt = new Date();
            return { finalVerdict, consensusScore };
        }

        const case_doc = await this.collection.findOne({ _id: caseId });

        const trueVotes = case_doc.votes.filter(v => v.vote === 'true').length;
        const falseVotes = case_doc.votes.filter(v => v.vote === 'false').length;

        const finalVerdict = trueVotes > falseVotes ? 'true' : 'false';
        const consensusScore = Math.round((Math.max(trueVotes, falseVotes) / Math.max(case_doc.votes.length, 1)) * 100);

        await this.collection.updateOne(
            { _id: caseId },
            {
                $set: {
                    status: 'resolved',
                    finalVerdict,
                    consensusScore,
                    resolvedAt: new Date()
                }
            }
        );

        return { finalVerdict, consensusScore };
    }

    // Get pending cases
    async getPendingCases() {
        if (!this.collection) {
            return this.memoryCases.filter(c => c.status === 'pending');
        }
        return await this.collection.find({ status: 'pending' }).toArray();
    }

    // Get specific case
    async getCase(caseId) {
        if (!this.collection) {
            const caseStrId = caseId.toString();
            return this.memoryCases.find(c => c._id === caseStrId) || null;
        }
        try {
            const { ObjectId } = require('mongodb');
            return await this.collection.findOne({ _id: new ObjectId(caseId) });
        } catch (e) {
            return await this.collection.findOne({ _id: caseId });
        }
    }

    // Update onChainId
    async updateOnChainId(caseId, onChainId) {
        if (!this.collection) {
            const caseStrId = caseId.toString();
            const case_doc = this.memoryCases.find(c => c._id === caseStrId);
            if (case_doc) case_doc.onChainId = onChainId;
            return;
        }
        await this.collection.updateOne(
            { _id: caseId },
            { $set: { onChainId: onChainId } }
        );
    }
}

module.exports = { TruthDAO };
