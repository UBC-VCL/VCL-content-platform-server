/**
 * Error codes for Snapshot CRUD endpoints. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum. 
 * 
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 * 
 * If an error code is no longer used, then comment it out. If you are adding a new error, 
 * you can use any commented out error code instead of creating a new one.
 */

const SNAPSHOT_ERR = {
	SNAPSHOT001: 'SNAPSHOT001',
	SNAPSHOT002: 'SNAPSHOT002',
	SNAPSHOT003: 'SNAPSHOT003',
	SNAPSHOT004: 'SNAPSHOT004'
};

Object.freeze(SNAPSHOT_ERR);

export default SNAPSHOT_ERR;