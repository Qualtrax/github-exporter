import { Mock } from 'tsmockit';
import { IRouter } from 'tsbase-components/routing/Router/IRouter';
import { Environments, EnvironmentVariables } from './Environments';
import { App } from './App';

describe('App', () => {
  const routerMainEL = document.createElement('main');
  const mockRouter = new Mock<IRouter>();
  let classUnderTest: App;

  beforeAll(() => {
    classUnderTest = App.Instance();
  });

  it('should construct with no environment defined', () => {
    expect(classUnderTest).toBeDefined();
    expect(classUnderTest.EnvironmentVariables.get(EnvironmentVariables.Mode))
      .toEqual(Environments.Development);
  });

  it('should construct in development', () => {
    document.body.appendChild(routerMainEL);
    mockRouter.Setup(r => r.Start(routerMainEL, 'not-found'), null);

    classUnderTest = App.Instance(Environments.Development, mockRouter.Object);

    expect(classUnderTest).toBeDefined();
    expect(classUnderTest.EnvironmentVariables.get(EnvironmentVariables.Mode))
      .toEqual(Environments.Development);
  });

  it('should construct in production', () => {
    document.body.appendChild(routerMainEL);
    mockRouter.Setup(r => r.Start(routerMainEL, 'not-found'), null);

    classUnderTest = App.Instance(Environments.Production, mockRouter.Object);

    expect(classUnderTest).toBeDefined();
    expect(classUnderTest.EnvironmentVariables.get(EnvironmentVariables.Mode))
      .toEqual(Environments.Production);
  });

});
