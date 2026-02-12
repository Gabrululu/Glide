// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GlideSession
 * @dev Manages user trial sessions on-chain
 * All sessions are transparent and verifiable on BaseScan
 */
contract GlideSession is Ownable, ReentrancyGuard {
    struct Session {
        address user;
        uint256 startTime;
        uint256 endTime;
        uint256 initialBalance;
        uint256 currentBalance;
        bool isActive;
        uint256 transactionCount;
        uint256 gasSaved; // in wei
    }
    
    struct Transaction {
        string txType; // "swap", "invest", "transfer"
        uint256 amount;
        uint256 timestamp;
        string details;
    }
    
    // Mappings
    mapping(bytes32 => Session) public sessions;
    mapping(bytes32 => Transaction[]) public sessionTransactions;
    mapping(address => bytes32[]) public userSessions;
    
    // Events
    event SessionCreated(
        bytes32 indexed sessionId,
        address indexed user,
        uint256 startTime,
        uint256 endTime,
        uint256 initialBalance
    );
    
    event TransactionRecorded(
        bytes32 indexed sessionId,
        string txType,
        uint256 amount,
        string details
    );
    
    event SessionSettled(
        bytes32 indexed sessionId,
        address indexed user,
        uint256 finalBalance,
        uint256 gasSaved
    );
    
    event SessionClosed(bytes32 indexed sessionId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new trial session
     */
    function createSession(
        address user,
        uint256 trialDays,
        uint256 initialBalance
    ) external returns (bytes32) {
        bytes32 sessionId = keccak256(
            abi.encodePacked(user, block.timestamp, block.number)
        );
        
        require(sessions[sessionId].user == address(0), "Session already exists");
        
        uint256 endTime = block.timestamp + (trialDays * 1 days);
        
        sessions[sessionId] = Session({
            user: user,
            startTime: block.timestamp,
            endTime: endTime,
            initialBalance: initialBalance,
            currentBalance: initialBalance,
            isActive: true,
            transactionCount: 0,
            gasSaved: 0
        });
        
        userSessions[user].push(sessionId);
        
        emit SessionCreated(sessionId, user, block.timestamp, endTime, initialBalance);
        
        return sessionId;
    }
    
    /**
     * @dev Record a transaction in the session
     */
    function recordTransaction(
        bytes32 sessionId,
        string memory txType,
        uint256 amount,
        string memory details,
        uint256 gasSaved
    ) external {
        Session storage session = sessions[sessionId];
        require(session.isActive, "Session not active");
        require(session.user != address(0), "Session does not exist");
        
        sessionTransactions[sessionId].push(Transaction({
            txType: txType,
            amount: amount,
            timestamp: block.timestamp,
            details: details
        }));
        
        session.transactionCount++;
        session.gasSaved += gasSaved;
        
        emit TransactionRecorded(sessionId, txType, amount, details);
    }
    
    /**
     * @dev Update session balance
     */
    function updateBalance(bytes32 sessionId, uint256 newBalance) external {
        Session storage session = sessions[sessionId];
        require(session.isActive, "Session not active");
        require(session.user != address(0), "Session does not exist");
        
        session.currentBalance = newBalance;
    }
    
    /**
     * @dev Settle and close a session
     */
    function settleSession(bytes32 sessionId) external nonReentrant {
        Session storage session = sessions[sessionId];
        require(session.isActive, "Session not active");
        require(session.user != address(0), "Session does not exist");
        
        session.isActive = false;
        
        emit SessionSettled(
            sessionId,
            session.user,
            session.currentBalance,
            session.gasSaved
        );
        
        emit SessionClosed(sessionId);
    }
    
    /**
     * @dev Get session details
     */
    function getSession(bytes32 sessionId) external view returns (Session memory) {
        return sessions[sessionId];
    }
    
    /**
     * @dev Get all sessions for a user
     */
    function getUserSessions(address user) external view returns (bytes32[] memory) {
        return userSessions[user];
    }
    
    /**
     * @dev Get transaction count for a session
     */
    function getTransactionCount(bytes32 sessionId) external view returns (uint256) {
        return sessionTransactions[sessionId].length;
    }
    
    /**
     * @dev Get specific transaction
     */
    function getTransaction(
        bytes32 sessionId,
        uint256 index
    ) external view returns (Transaction memory) {
        require(index < sessionTransactions[sessionId].length, "Invalid index");
        return sessionTransactions[sessionId][index];
    }
    
    /**
     * @dev Check if session is expired
     */
    function isSessionExpired(bytes32 sessionId) external view returns (bool) {
        Session memory session = sessions[sessionId];
        return block.timestamp > session.endTime;
    }
    
    /**
     * @dev Get remaining time in session
     */
    function getRemainingTime(bytes32 sessionId) external view returns (uint256) {
        Session memory session = sessions[sessionId];
        if (block.timestamp >= session.endTime) {
            return 0;
        }
        return session.endTime - block.timestamp;
    }
}
