
import { STATUS_CONTENT, TONE_CLASSES, NOT_SUBMITTED } from '../util/kycConstants';

const KycStatusBanner = ({ status }) => {
  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT[NOT_SUBMITTED];
  const tone = TONE_CLASSES[content.tone];
  const Icon = content.icon;
  const BadgeIcon = content.badgeIcon;

  return (
    <div className={`relative overflow-hidden border rounded-2xl p-6 shadow-md ${tone.wrap}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <span className={`flex-shrink-0 p-3 rounded-2xl ${tone.iconWrap}`}>
            <Icon size={26} />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">{content.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{content.description}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center ${tone.badge}`}
        >
          <BadgeIcon size={14} />
          {content.badge}
        </span>
      </div>
    </div>
  );
};

export default KycStatusBanner;
