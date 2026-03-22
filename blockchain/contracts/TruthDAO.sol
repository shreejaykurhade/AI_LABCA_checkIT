// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TruthDAO {
    struct Case {
        uint256 id;
        string query;
        string analysisHash; // Reference to the analysis (e.g., CID or hash)
        uint256 timestamp;
        uint256 trueVotes;
        uint256 falseVotes;
        bool exists;
        mapping(address => bool) hasVoted;
    }

    uint256 public caseCount;
    mapping(uint256 => Case) public cases;

    event CaseEscalated(uint256 indexed id, string query, string analysisHash);
    event VoteCast(uint256 indexed id, address indexed voter, bool vote, string reasoning);

    function escalateCase(string memory _query, string memory _analysisHash) public returns (uint256) {
        caseCount++;
        Case storage newCase = cases[caseCount];
        newCase.id = caseCount;
        newCase.query = _query;
        newCase.analysisHash = _analysisHash;
        newCase.timestamp = block.timestamp;
        newCase.exists = true;

        emit CaseEscalated(caseCount, _query, _analysisHash);
        return caseCount;
    }

    function vote(uint256 _id, bool _vote, string memory _reasoning) public {
        require(cases[_id].exists, "Case does not exist");
        require(!cases[_id].hasVoted[msg.sender], "Address has already voted");

        if (_vote) {
            cases[_id].trueVotes++;
        } else {
            cases[_id].falseVotes++;
        }

        cases[_id].hasVoted[msg.sender] = true;

        emit VoteCast(_id, msg.sender, _vote, _reasoning);
    }

    function getCase(uint256 _id) public view returns (
        uint256 id,
        string memory query,
        string memory analysisHash,
        uint256 timestamp,
        uint256 trueVotes,
        uint256 falseVotes
    ) {
        require(cases[_id].exists, "Case does not exist");
        Case storage c = cases[_id];
        return (c.id, c.query, c.analysisHash, c.timestamp, c.trueVotes, c.falseVotes);
    }
}
