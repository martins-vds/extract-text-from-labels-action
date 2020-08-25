import vm from 'vm'

export class SafeRegExp extends RegExp {
  timeout: number
  pattern: string
  /**
   *
   */
  constructor(pattern: string, timeout: number, flags?: string) {
    super(pattern, flags)
    this.pattern = pattern
    this.timeout = timeout
  }

  /**
   * test
   */
  public test(string: string): boolean {
    var sandbox = {
      result: false
    }

    var context = vm.createContext(sandbox)

    var script = new vm.Script(
      `result = /${this.pattern}/${this.flags}.test(\'${string}\');`
    )

    try {
      // One could argue if a RegExp hasn't processed in a given time.
      // then, its likely it will take exponential time.
      script.runInContext(context, {timeout: this.timeout}) // milliseconds

      return sandbox.result
    } catch (e) {
      return false
    }
  }

  /**
   * exec
   */
  public exec(string: string): RegExpExecArray {
    var sandbox = {
      result: <RegExpExecArray>{}
    }

    var context = vm.createContext(sandbox)

    var script = new vm.Script(
      `result = /${this.pattern}/${this.flags}.exec(\'${string}\');`
    )

    try {
      // One could argue if a RegExp hasn't processed in a given time.
      // then, its likely it will take exponential time.
      script.runInContext(context, {timeout: this.timeout}) // milliseconds

      return sandbox.result
    } catch (e) {
      return null
    }
  }
}
