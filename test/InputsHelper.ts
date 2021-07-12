export class InputsHelper {
  public static setInputs(inputs: Record<string, string>) {
    Object.entries(inputs).forEach(([key, value]) => {
      this.setInput(key, value);
    });
  }

  public static clearInputs(names: string[]) {
    names.forEach(name => {
      this.clearInput(name);
    });
  }

  private static setInput(name: string, value: string) {
    process.env[this.getEnvVariableName(name)] = value;
  }

  private static clearInput(name: string) {
    process.env[this.getEnvVariableName(name)] = '';
  }

  private static getEnvVariableName(name: string): string {
    return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
  }
}
