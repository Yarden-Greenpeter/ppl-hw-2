import { ClassExp, ProcExp, Exp, Program, makeProcExp, makeVarDecl, Binding, IfExp, BoolExp, makeBoolExp, makeIfExp, makeAppExp, makePrimOp, makeVarRef, makeLitExp } from "./L3-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { isEmpty, slice } from "ramda";
import { makeSymbolSExp } from "./L3-value";
/*
for 0<=i<=n-1 argi = field i
argn = method name
body{
    if argn === methodname0 do method 0
    else if argn ====methodname1 do method 1
    if argn != method names make error!
}
func(arg1, arg2, arg3, ....., argn){
    body
}

*/


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
        makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), 
                                                makeLitExp(makeSymbolSExp(methodsBinding[0].var.var))]),
        makeAppExp(methodsBinding[0].val, []),
        methodsBinding.length > 1 ? 
        makeMethods(methodsBinding.slice(1)): 
        makeBoolExp(false)
    )
}

/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const lexTransform = (exp: Exp | Program): Result<Exp | Program> =>
    {return makeFailure("TODO")}