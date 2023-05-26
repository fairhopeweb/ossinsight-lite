import { widgets } from '@/app/bind-client';
import WidgetContext from '@/packages/ui/context/widget';
import { useVisible } from '@/packages/ui/hooks/visible';
import mergeRefs from '@/packages/ui/utils/merge-refs';
import { readItem, useUpdater, useWatchItemFields } from '@ossinsight-lite/ui/hooks/bind';
import useRefCallback from '@ossinsight-lite/ui/hooks/ref-callback';
import { forwardRef } from 'react';

export interface WidgetCoordinator {
  dashboardName?: string;
  name: string;
  props: any;
  _id: string;
  editMode: boolean;
  draggable: boolean;
}

export const WidgetCoordinator = forwardRef<HTMLDivElement, WidgetCoordinator>(({ dashboardName, name, _id: id, draggable, editMode, props: passInProps }, ref) => {
  const widget = readItem(widgets, name).current;

  const { props: watchingProps } = useWatchItemFields('library', id, ['props']);
  const updater = useUpdater('library', id);

  const props = { ...passInProps, ...watchingProps };

  const onPropChange = useRefCallback((key: string, value: any) => {
    updater((item) => {
      item.props = { ...item.props, [key]: value };
      return item;
    });
  });

  const Widget = widget.default;
  const { ref: visibleRef, visible } = useVisible<HTMLDivElement>();

  return (
    <WidgetContext.Provider
      value={{
        onPropChange,
        props,
        visible,
        configuring: false,
        creating: false,
      }}
    >
      <Widget ref={mergeRefs(ref, visibleRef)} {...props} />
    </WidgetContext.Provider>
  );
});
