import * as React from 'react';
import DateTimePicker, { DateTimePickerProps } from '../../DateTimePicker/DateTimePicker';
import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { mount, utilsToUse } from '../test-utils';

const format = process.env.UTILS === 'moment' ? 'MM/DD/YYYY HH:mm' : 'MM/dd/yyyy hh:mm';

describe('e2e - DateTimePicker', () => {
  let component: ReactWrapper<DateTimePickerProps>;

  const onCloseMock = jest.fn();
  const onChangeMock = jest.fn();

  beforeEach(() => {
    component = mount(
      <DateTimePicker
        format={format}
        onClose={onCloseMock}
        onChange={onChangeMock}
        value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
      />
    );
  });

  it('Should renders', () => {
    expect(component).toBeTruthy();
  });

  it('Should open modal with picker on click', () => {
    component.find('input').simulate('click');
    expect(component.find('Dialog').props().open).toBeTruthy();
  });

  it('Should update state when passing new value from outside', () => {
    component.setProps({ value: '2018-01-01T00:00:00.000Z' });
    component.update(); // make additional react tick to update text field

    const expectedString = utilsToUse.format(utilsToUse.date('2018-01-01T00:00:00.000Z'), format);
    expect(component.find('input').props().value).toBe(expectedString);
  });

  it('Should change internal state on update', () => {
    component.find('input').simulate('click');
    component
      .find('Day button')
      .at(3)
      .simulate('click');

    expect(
      component
        .find('ToolbarButton')
        .at(0)
        .text()
    ).toBe('2018');
    // expect(component.find('ToolbarButton').at(1).text()).toBe('Jan 3');
  });

  it('Should handle accept on enter', () => {
    component.find('input').simulate('click');
    const onKeyDown = component
      .find('EventListener')
      .at(0)
      .props().onKeyDown;

    if (!onKeyDown) {
      throw new Error('Expected onKeyDown to be non-null');
    }

    act(() => {
      onKeyDown({
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any);
    });

    expect(onCloseMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalled();
  });
});

describe('e2e -- Controlling open state', () => {
  let component: ReactWrapper<DateTimePickerProps>;
  const onCloseMock = jest.fn();

  beforeEach(() => {
    component = mount(
      <DateTimePicker
        open
        onClose={onCloseMock}
        onChange={jest.fn()}
        value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
      />
    );
  });

  it('Should be opened', () => {
    expect(component.find('WithStyles(Dialog)').prop('open')).toBeTruthy();
  });

  it('Should close', () => {
    component
      .find('DialogActions button')
      .at(0)
      .simulate('click');
    expect(onCloseMock).toHaveBeenCalled();
  });
});
