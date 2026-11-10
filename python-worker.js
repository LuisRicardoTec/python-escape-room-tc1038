/* Pyodide runs in a dedicated worker. The parent terminates it on timeout. */
let ready;
self.onmessage=async ({data})=>{
 const {code,kind}=data;
 try{
  if(!ready){importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');ready=loadPyodide();}
  const py=await ready;
  py.globals.set('user_source',code);
  py.globals.set('challenge_kind',kind);
  const result=await py.runPythonAsync(`
import ast, json, io, contextlib, traceback
source=user_source
kind=challenge_kind
results=[]
try:
    tree=ast.parse(source)
    if any(isinstance(n,(ast.Import,ast.ImportFrom)) for n in ast.walk(tree)):
        raise ValueError('Para esta actividad no se permiten importaciones.')
    if any(isinstance(n,(ast.Global,ast.Nonlocal)) for n in ast.walk(tree)):
        raise ValueError('No se permiten declaraciones global o nonlocal.')
    env={'__builtins__':__builtins__}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(compile(tree,'<estudiante>','exec'),env,env)
    if kind=='list':
        f=env.get('modificar_lista')
        if not callable(f): raise ValueError('Debes definir la función modificar_lista(letras).')
        for original,expected in [(['c','a','s','a'],['c','o','s','a','!']),(['m','a','p','a'],['m','o','p','a','!']),(['x','a'],['x','o','!'])]:
            inp=original.copy()
            with contextlib.redirect_stdout(io.StringIO()): ret=f(inp)
            ok=inp==expected and ret is inp
            results.append({'test':str(original),'ok':ok,'detail':'La lista debe modificarse en el mismo objeto y devolverse.' if not ok else 'Correcto'})
    elif kind=='convert':
        f=env.get('reparar_clave')
        if not callable(f): raise ValueError('Debes definir la función reparar_clave(texto).')
        for original,expected in [('codigo','XodigZ'),('python','XythoZ'),('ab','XZ'),('1111','X11Z')]:
            with contextlib.redirect_stdout(io.StringIO()): ret=f(original)
            ok=ret==expected and type(ret) is str
            results.append({'test':repr(original),'ok':ok,'detail':'Esperado: '+repr(expected)+'. Obtenido: '+repr(ret) if not ok else 'Correcto'})
    elif kind=='final':
        f=env.get('activar_salida')
        if not callable(f): raise ValueError('Debes definir la función activar_salida(clave).')
        for original,expected in [('casa','c@s!'),('Python','Pytho!'),('Alarma','@l@rm!'),('a','!'),('AAAA','@@@!'),('xyz','xy!')]:
            with contextlib.redirect_stdout(io.StringIO()): ret=f(original)
            ok=ret==expected and type(ret) is str
            results.append({'test':repr(original),'ok':ok,'detail':'Esperado: '+repr(expected)+'. Obtenido: '+repr(ret) if not ok else 'Correcto'})
    else: raise ValueError('Tipo de reto desconocido.')
    output={'ok':all(t['ok'] for t in results),'tests':results}
except Exception as exc:
    output={'ok':False,'error':type(exc).__name__+': '+str(exc),'tests':results}
json.dumps(output,ensure_ascii=False)
`);
  self.postMessage(JSON.parse(result));
 }catch(e){self.postMessage({ok:false,error:String(e),tests:[]});}
};
