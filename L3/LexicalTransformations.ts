import { ClassExp, ProcExp, Exp, Program, isProcExp, isLetExp, isLitExp, makeProcExp, makeVarDecl, Binding, makeProgram, IfExp, BoolExp, makeBoolExp, makeIfExp, makeAppExp, makePrimOp, makeVarRef, makeLitExp, isExp, isProgram, isClassExp, isDefineExp, DefineExp, CExp, makeDefineExp, isNumExp, isBoolExp, isStrExp, isPrimOp, isVarRef, isAppExp, isIfExp } from "./L3-ast";
import { Result, makeFailure, makeOk, bind, mapResult } from "../shared/result";
import { isEmpty, slice } from "ramda";
import { makeSymbolSExp } from "./L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>
    {return makeProcExp(exp.fields, [makeProcExp([makeVarDecl("msg")], [makeMethods(exp.methods)])]);}


const makeMethods = (methodsBinding : Binding[]): IfExp|BoolExp => {
    return isEmpty(methodsBinding) ? makeBoolExp(false):
    makeIfExp(
        //test
        makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeLitExp(makeSymbolSExp(methodsBinding[0].var.var))]),
        //then
        makeAppExp(methodsBinding[0].val, []),
        //else 
        makeMethods(methodsBinding.slice(1))
    )
}

/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const lexTransform = (exp: Exp | Program): Result<Exp | Program> => {
    return isExp(exp) ? (transformExp(exp)) :
           bind(mapResult(transformExp, exp.exps), (exps: Exp[]) => makeOk(makeProgram(exps)))
}

const transformExp = (exp: Exp): Result<Exp> => {
    return isDefineExp(exp) ? 
    bind(transformCExp(exp.val), (val: CExp) => makeOk(makeDefineExp(exp.var, val))) :
    transformCExp(exp);
};
// NumExp | BoolExp | StrExp | PrimOp | VarRef;
// AppExp | IfExp | ProcExp | LetExp | LitExp | ClassExp;
const transformCExp = (exp: Exp): Result<CExp> => {
    return isNumExp(exp) ? makeOk(exp) :
           isBoolExp(exp) ? makeOk(exp) :
           isStrExp(exp) ? makeOk(exp) :
           isPrimOp(exp) ? makeOk(exp) :
           isVarRef(exp) ? makeOk(exp) :
           isAppExp(exp) ? makeOk(exp) :
           isIfExp(exp) ? makeOk(exp) :
           isProcExp(exp) ? makeOk(exp) :
           isLetExp(exp) ? makeOk(exp) :
           isLitExp(exp) ? makeOk(exp) :
           isClassExp(exp) ? makeOk(class2proc(exp)) :
           makeFailure("Undifiended expression")
}
