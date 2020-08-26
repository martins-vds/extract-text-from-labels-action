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
  test(string: string): boolean {
    const sandbox = {
      result: false
    }

    const context = vm.createContext(sandbox)

    const script = new vm.Script(
      `result = /${this.pattern}/${this.flags}.test('${string}');`
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
  exec(string: string): RegExpExecArray {
    const sandbox = {
      result: null as RegExpExecArray
    }

    const context = vm.createContext(sandbox)

    const script = new vm.Script(
      `result = /${this.pattern}/${this.flags}.exec('${string}');`
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
