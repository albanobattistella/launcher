import * as React from 'react';

export interface IPathInputProps {
  /** Default value of the file path input element */
  defaultInput?: string;
  /** When the input value is changed */
  onInputChange?: (input: string) => void;
  /** If the current input is valid */
  isValid?: boolean;
}

export interface IPathInputState {
  /** Value of the text input element */
  input: string;
}

export class PathInput extends React.Component<IPathInputProps, IPathInputState> {
  constructor(props: IPathInputProps) {
    super(props);
    this.state = {
      input: this.props.defaultInput || '',
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.onBrowseClick = this.onBrowseClick.bind(this);
    if (this.props.onInputChange) { this.props.onInputChange(this.state.input); }
  }

  render() {
    const isValid = this.props.isValid;
    let className: string = 'flashpoint-path__input';
    if (isValid !== undefined) {
      className += isValid ? ' flashpoint-path__input--valid' : ' flashpoint-path__input--invalid';
    }
    return (
      <>
        <input type="text" value={this.state.input} onChange={this.onInputChange} className={className} />
        <input type="button" value="Browse" onClick={this.onBrowseClick} />
      </>
    );
  }

  onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setInput(cleanFilePath(event.target.value));
  }

  onBrowseClick(event: React.MouseEvent<HTMLInputElement>): void {
    // Synchronously show a "open dialog" (this makes the main window "frozen" while this is open)
    const filePaths = window.External.showOpenDialog({
      title: 'Select the FlashPoint root directory',
      properties: ['openDirectory'],
    });
    if (filePaths) {
      this.setInput(cleanFilePath(filePaths[0]));
    }
  }

  setInput(input: string): void {
    this.setState({ input: input });
    if (this.props.onInputChange) { this.props.onInputChange(input); }
  }
}

function cleanFilePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}