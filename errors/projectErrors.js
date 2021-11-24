/**
 * Error codes for the Project endpoints. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum.
 *
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 * 
 * If an error code is no longer used, then comment it out. If you are adding a new error, 
 * you can use any commented out error code instead of creating a new one.
 */

const PROJECT_ERR = {
    PROJECT001: "PROJECT001",
    PROJECT002: "PROJECT002",
    // PROJECT003: "PROJECT003",
    PROJECT004: "PROJECT004",
    PROJECT005: "PROJECT005"
};
  
Object.freeze(PROJECT_ERR);

export default PROJECT_ERR;