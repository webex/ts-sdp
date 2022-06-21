import {
  BandwidthLine,
  BundleGroupLine,
  ConnectionLine,
  OriginLine,
  SessionInformationLine,
  SessionNameLine,
  VersionLine,
} from './lines';
import { TimingLine } from './lines/timing-line';
import { SessionDescription } from './model';

describe('session description', () => {
  it('should put the lines in the correct order', () => {
    expect.hasAssertions();
    const sd = new SessionDescription();
    sd.version = new VersionLine(0);
    sd.origin = new OriginLine('username', 'sessionId', 42, 'IN', 'IPV4', '127.0.0.1');
    sd.sessionName = new SessionNameLine('session-name');
    sd.information = new SessionInformationLine('info');
    sd.connection = new ConnectionLine('IN', 'IPV4', '127.0.0.1');
    sd.timing = new TimingLine(0, 0);
    sd.groups.push(new BundleGroupLine(['1', '2', '3']));
    sd.bandwidth = new BandwidthLine('TIAS', 1000000);
    const lines = sd.toLines();
    expect(lines.indexOf(sd.version)).toBe(0);
    expect(lines.indexOf(sd.origin)).toBe(1);
    expect(lines.indexOf(sd.sessionName)).toBe(2);
    expect(lines.indexOf(sd.information)).toBe(3);
    expect(lines.indexOf(sd.connection)).toBe(4);
    expect(lines.indexOf(sd.bandwidth)).toBe(5);
    expect(lines.indexOf(sd.timing)).toBe(6);
  });
});
