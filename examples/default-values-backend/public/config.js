import React, { Component } from 'react';
import { render } from 'react-dom';

import { init, locations } from '@contentful/app-sdk';
import { Heading, Note, Form, TextInput } from '@contentful/f36-components';

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = { parameters: { defaultValue: 'a default' } };
    this.app = this.props.sdk.app;
    this.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    const parameters = await this.app.getParameters();
    this.setState({ parameters: parameters || { defaultValue: 'a default' } }, () =>
      this.app.setReady()
    );
  }

  render() {
    return (
      <Form id="app-config">
        <Heading>Default values App</Heading>
        <Note title="About the app">Set a default title for an example content type!</Note>
        <TextInput
          name="default value"
          labelText="Default value"
          value={this.state.parameters.defaultValue}
          onChange={(e) => this.setState({ parameters: { defaultValue: e.target.value } })}
        ></TextInput>
      </Form>
    );
  }

  async onConfigure() {
    const { items: contentTypes } = await this.props.sdk.space.getContentTypes();

    return {
      parameters: this.state.parameters,
    };
  }
}

init((sdk) => {
  const root = document.getElementById('root');
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<Config sdk={sdk} />, root);
  } else {
    throw new Error('rendered outside of config location');
  }
});
