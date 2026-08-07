import { afterAll, afterEach, beforeAll, describe } from "vitest";
import { createAuthedUser } from "../helpers/helper.js";
import { connectTestDb, clearTestDb, closeTestDb } from "../setup.js";

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

describe('POST /Expense', () => {
    //
})