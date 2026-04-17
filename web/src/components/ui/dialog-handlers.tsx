'use client';

const DIALOG_SEARCH_PARAM_NAME = 'a';

const handleDialogOpen = (params: URLSearchParams, value: string) => {
  const dialogs_value = params.get(DIALOG_SEARCH_PARAM_NAME);
  const dialogs = dialogs_value?.split(',');
  const _dialogs = dialogs?.filter((d) => d !== value) ?? [];
  _dialogs.push(value);
  const _dialogs_value = _dialogs?.join(',');
  if (_dialogs_value) params.set(DIALOG_SEARCH_PARAM_NAME, _dialogs_value);
  else params.delete(DIALOG_SEARCH_PARAM_NAME);
  return params;
};

const handleDialogClose = (params: URLSearchParams, value: string) => {
  const dialogs_value = params.get(DIALOG_SEARCH_PARAM_NAME);
  const dialogs = dialogs_value?.split(',');
  const _dialogs = dialogs?.filter((d) => d !== value);
  const _dialogs_value = _dialogs?.join(',');
  if (_dialogs_value) params.set(DIALOG_SEARCH_PARAM_NAME, _dialogs_value);
  else params.delete(DIALOG_SEARCH_PARAM_NAME);
  return params;
};

const isDialogOpen = (params: URLSearchParams, value: string) => {
  // params.has(DIALOG_SEARCH_PARAM_NAME, value)
  return params.get(DIALOG_SEARCH_PARAM_NAME)?.split(',').includes(value);
};

export { DIALOG_SEARCH_PARAM_NAME, handleDialogOpen, handleDialogClose, isDialogOpen };
