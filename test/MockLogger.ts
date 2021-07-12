export class MockLogger {
  private readonly _logs: string[] = [];

  public log(error: string | Error) {
    this._logs.push(
      `${typeof error === 'string' ? error : `Error: ${error.message}`}`
    );
  }

  public clear() {
    this._logs.length = 0;
  }

  public get logs(): string {
    return this._logs.join('\n');
  }
}
