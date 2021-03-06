"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../lexer/tokens");
const lexer_1 = require("../lexer/lexer");
const mySqlError_1 = require("../checker/checks/generic/mySqlError");
const missingWhere_1 = require("../checker/checks/delete/missingWhere");
const oddCodePoint_1 = require("../checker/checks/generic/oddCodePoint");
const databaseNotFound_1 = require("../checker/checks/use/databaseNotFound");
const invalidDropOption_1 = require("../checker/checks/drop/invalidDropOption");
/**
 * Runs all the checks.
 */
class CheckerRunner {
    /**
     * Simple checks are ones that don't require a database connection
     */
    runSimpleChecks(sqlQueries, printer, prefix) {
        const checkOddCodePoint = new oddCodePoint_1.OddCodePoint();
        const checkMissingWhere = new missingWhere_1.MissingWhere();
        const invalidDropOption = new invalidDropOption_1.InvalidDropOption();
        sqlQueries.forEach((query) => {
            const content = query.getContent().trim();
            if (content) {
                const category = lexer_1.categorise(content);
                const tokenised = lexer_1.tokenise(query);
                if (category === tokens_1.Keyword.Select) {
                    const checker = checkOddCodePoint;
                    printer.printCheck(checker, tokenised, prefix);
                }
                else if (category === tokens_1.Keyword.Delete) {
                    const checker = checkMissingWhere;
                    printer.printCheck(checker, tokenised, prefix);
                }
                else if (category === tokens_1.Keyword.Drop) {
                    const checker = invalidDropOption;
                    printer.printCheck(checker, tokenised, prefix);
                }
            }
        });
    }
    runDatabaseChecks(sqlQueries, database, printer, prefix) {
        const checkOddCodePoint = new oddCodePoint_1.OddCodePoint();
        const checkMissingWhere = new missingWhere_1.MissingWhere();
        const invalidDropOption = new invalidDropOption_1.InvalidDropOption();
        sqlQueries.forEach((query) => {
            const content = query.getContent().trim();
            if (content) {
                const category = lexer_1.categorise(content);
                const tokenised = lexer_1.tokenise(query);
                database.lintQuery(database.connection, content, (results) => {
                    const checker = new mySqlError_1.MySqlError(results);
                    printer.printCheck(checker, tokenised, prefix);
                });
                if (category === tokens_1.Keyword.Select) {
                    const checker = checkOddCodePoint;
                    printer.printCheck(checker, tokenised, prefix);
                }
                else if (category === tokens_1.Keyword.Use) {
                    database.getDatabases(database.connection, (results) => {
                        const checker = new databaseNotFound_1.DatabaseNotFound(results);
                        printer.printCheck(checker, tokenised, prefix);
                    });
                }
                else if (category === tokens_1.Keyword.Delete) {
                    const checker = checkMissingWhere;
                    printer.printCheck(checker, tokenised, prefix);
                }
                else if (category === tokens_1.Keyword.Drop) {
                    const checker = invalidDropOption;
                    printer.printCheck(checker, tokenised, prefix);
                }
            }
        });
    }
    run(sqlQueries, printer, prefix, database) {
        if (database) {
            return this.runDatabaseChecks(sqlQueries, database, printer, prefix);
        }
        return this.runSimpleChecks(sqlQueries, printer, prefix);
    }
}
exports.CheckerRunner = CheckerRunner;
//# sourceMappingURL=checkerRunner.js.map