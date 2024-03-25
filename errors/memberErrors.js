/**
 * Error codes for MEMBER logic. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum. 
 * 
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 */

const MEMBER_ERR = {
	MEMBER001: 'MEMBER001',
	MEMBER002: 'MEMBER002',
	MEMBER003: 'MEMBER003',
	MEMBER004: 'MEMBER004'
};

Object.freeze(MEMBER_ERR);

export default MEMBER_ERR;