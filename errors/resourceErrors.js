/**
 * Error codes for authentication logic. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum.
 *
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 *
 * If an error code is no longer used, then comment it out. If you are adding a new error,
 * you can use any commented out error code instead of creating a new one.
 */

const RESOURCE_ERR = {
	RESOURCE001: 'RESOURCE001',
	RESOURCE002: 'RESOURCE002',
	RESOURCE003: 'RESOURCE003',
	RESOURCE004: 'RESOURCE004',
	RESOURCE005: 'RESOURCE005',
};

Object.freeze(RESOURCE_ERR);

export default RESOURCE_ERR;
