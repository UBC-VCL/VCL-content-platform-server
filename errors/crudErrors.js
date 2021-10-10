/**
 * Error codes for CRUD logic. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum. 
 * 
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 */

const CRUD_ERR = {
	CRUD001: 'CRUD001',
	CRUD002: 'CRUD002',
	CRUD003: 'CRUD003',
	CRUD004: 'CRUD004'
};

Object.freeze(CRUD_ERR);

export default CRUD_ERR;