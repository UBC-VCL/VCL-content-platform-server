/**
 * Error codes for authentication logic. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum.
 *
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 */

const AUTH_ERR = {
  AUTH001: "AUTH001",
  AUTH002: "AUTH002",
  AUTH003: "AUTH003",
  AUTH004: "AUTH004",
  AUTH005: "AUTH005",
  AUTH006: "AUTH006",
  AUTH007: "AUTH007",
};

Object.freeze(AUTH_ERR);

export default AUTH_ERR;
