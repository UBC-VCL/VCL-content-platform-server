/**
 * Error codes for the Project endpoints. Every time a new error is sent as a response
 * to the client, it should have a NEW, UNIQUE error code - meaning you should add one
 * to this enum.
 *
 * Every code in this enum should only be used ONCE - it is a unique identifier!
 */

const PROJECT_ERR = {
    PROJECT001: "PROJECT001"
};
  
Object.freeze(PROJECT_ERR);

export default PROJECT_ERR;