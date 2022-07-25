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

const AUTH_ERR = {
  AUTH001: "AUTH001",
  AUTH002: "AUTH002",
  AUTH003: "AUTH003",
  AUTH004: "AUTH004",
  AUTH005: "AUTH005",
  AUTH006: "AUTH006",
  AUTH007: "AUTH007",
  AUTH008: "AUTH008",
  AUTH009: "AUTH009",
};

Object.freeze(AUTH_ERR);

export default AUTH_ERR;
